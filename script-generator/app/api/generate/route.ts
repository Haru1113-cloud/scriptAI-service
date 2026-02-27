import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { getCredits, deductCredit, hasActiveSubscription } from "@/lib/credits";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  const { topic, contentType, duration, tone, targetAudience, deviceId } =
    await req.json();

  if (!topic) {
    return new Response("topic is required", { status: 400 });
  }

  if (!deviceId) {
    return new Response("deviceId is required", { status: 400 });
  }

  const isSubscribed = hasActiveSubscription(deviceId);
  if (!isSubscribed) {
    const credits = getCredits(deviceId);
    if (credits <= 0) {
      return new Response(
        JSON.stringify({ error: "insufficient_credits", credits }),
        { status: 402, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  const systemPrompt =
    contentType === "youtube"
      ? `あなたはプロのYouTube台本ライターです。視聴者を引きつける構成と、話し言葉として自然な台本を作成します。
必ず以下のセクションを含めてください：
1. 【動画構成】（タイムライン付き）
2. 【台本全文】（ナレーション）
3. 【サムネイルテキスト案】（3パターン）
4. 【動画説明文】（SEO最適化）
5. 【おすすめタグ】`
      : `あなたはプロのPodcast台本ライターです。耳で聴いて分かりやすい構成と、話し言葉として自然な台本を作成します。
必ず以下のセクションを含めてください：
1. 【エピソード構成】（タイムライン付き）
2. 【台本全文】（トーク内容）
3. 【イントロ・アウトロ文】
4. 【エピソード概要】（Show Notes用）
5. 【チャプターリスト】`;

  const userPrompt = `
テーマ：${topic}
ターゲット：${targetAudience || "一般向け"}
尺：${duration || "10分"}程度
トーン：${tone || "わかりやすく親しみやすい"}

上記の条件で台本を作成してください。
`;

  const stream = await client.messages.stream({
    model: "claude-opus-4-6",
    max_tokens: 8000,
    thinking: { type: "adaptive" },
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const event of stream) {
        if (
          event.type === "content_block_delta" &&
          event.delta.type === "text_delta"
        ) {
          controller.enqueue(encoder.encode(event.delta.text));
        }
      }
      if (!isSubscribed) deductCredit(deviceId);
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
}
