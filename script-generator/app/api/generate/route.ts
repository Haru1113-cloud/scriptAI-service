import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import {
  initDevice,
  getCredits,
  hasActiveSubscription,
  deductCredit,
  addCredits,
} from "@/lib/credits";

const client = new Anthropic();

export async function POST(request: NextRequest) {
  const { topic, contentType, duration, tone, targetAudience, deviceId } =
    await request.json();

  if (!deviceId || !topic) {
    return new Response("Missing required fields", { status: 400 });
  }

  initDevice(deviceId);
  const subscribed = hasActiveSubscription(deviceId);
  const credits = getCredits(deviceId);

  if (!subscribed && credits <= 0) {
    return new Response("Out of credits", { status: 402 });
  }

  const contentTypeLabel = contentType === "youtube" ? "YouTube動画" : "Podcast";

  const systemPrompt = `あなたはプロの${contentTypeLabel}台本ライターです。視聴者を引き込む、高品質な日本語の台本を生成してください。話し言葉で自然に読めるよう、ト書き（例：[カメラを見ながら]）も適宜含めて詳細に書いてください。`;

  const youtubeFormat = `台本には以下をすべて含めてください：
## タイトル案（3案）
## サムネイルテキスト案
## 動画説明文
## タグ（10個）
## 台本本文
- イントロ（つかみ）
- 本編（各セクション）
- アウトロ（CTA含む）`;

  const podcastFormat = `台本には以下をすべて含めてください：
## エピソードタイトル案（3案）
## イントロ
## チャプターリスト
## 各チャプターの詳細台本
## アウトロ
## Show Notes`;

  const userPrompt = `以下の条件で${contentTypeLabel}の台本を作成してください。

- テーマ: ${topic}
- 動画の長さ: ${duration}
- トーン: ${tone}
- ターゲット視聴者: ${targetAudience || "一般"}

${contentType === "youtube" ? youtubeFormat : podcastFormat}`;

  if (!subscribed) {
    deductCredit(deviceId);
  }

  const stream = client.messages.stream({
    model: "claude-opus-4-6",
    max_tokens: 4096,
    thinking: { type: "adaptive" },
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const encoder = new TextEncoder();

  const readableStream = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      } catch {
        // Refund credit if generation failed
        if (!subscribed) {
          addCredits(deviceId, 1);
        }
        controller.error(new Error("Generation failed"));
      }
    },
    async cancel() {
      stream.abort();
    },
  });

  return new Response(readableStream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
