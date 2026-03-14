import { NextRequest } from "next/server";
import {
  initDevice,
  getCredits,
  hasActiveSubscription,
  deductCredit,
} from "@/lib/credits";

const MOCK_MENU = `# 今週の献立プラン 🍽️

## 月曜日
**朝食：** トースト・目玉焼き・ヨーグルト
**昼食：** 鶏むね肉のサラダチキン丼
**夕食：** 豚の生姜焼き・味噌汁・ご飯

---

## 火曜日
**朝食：** バナナスムージー・全粒粉パン
**昼食：** 野菜たっぷりラーメン
**夕食：** 鮭のムニエル・ほうれん草のおひたし・ご飯

---

## 水曜日
**朝食：** 納豆ご飯・お味噌汁
**昼食：** ツナとアボカドのサンドイッチ
**夕食：** 鶏の照り焼き・ブロッコリー炒め・ご飯

---

## 木曜日
**朝食：** オートミール・フルーツ
**昼食：** 豚汁うどん
**夕食：** 牛肉と野菜の炒め物・ご飯

---

## 金曜日
**朝食：** フレンチトースト・サラダ
**昼食：** 鶏そぼろ丼
**夕食：** 刺身盛り合わせ・冷奴・ご飯

---

## 土曜日
**朝食：** パンケーキ・ベーコンエッグ
**昼食：** カレーライス（前夜の残り活用）
**夕食：** 焼肉・キムチ・わかめスープ

---

## 日曜日
**朝食：** 和定食（ご飯・焼き魚・お味噌汁・漬物）
**昼食：** ざるそば・天ぷら
**夕食：** すき焼き・ご飯

---

## 今週の買い物リスト
- 鶏むね肉・豚バラ・牛肉・鮭・刺身盛り合わせ
- 卵・納豆・豆腐・チーズ
- ブロッコリー・ほうれん草・アボカド・キムチ
- バナナ・フルーツ各種
- 全粒粉パン・オートミール
`;

async function streamMockResponse(text: string): Promise<ReadableStream> {
  const encoder = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      for (const char of text) {
        controller.enqueue(encoder.encode(char));
        await new Promise((r) => setTimeout(r, 8));
      }
      controller.close();
    },
  });
}

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

  // APIキー未設定またはプレースホルダーの場合はモック献立を返す
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const isMockMode = !apiKey || apiKey.startsWith("your_") || !apiKey.startsWith("sk-ant-");
  if (isMockMode) {
    const mockStream = await streamMockResponse(MOCK_MENU);
    return new Response(mockStream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const { default: Anthropic } = await import("@anthropic-ai/sdk");
  const client = new Anthropic();

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
        controller.error(new Error("Generation failed"));
      }
    },
    async cancel() {
      stream.abort();
    },
  });

  return new Response(readableStream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
