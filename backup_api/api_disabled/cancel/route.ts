import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { setSubscription } from "@/lib/credits";
import { readFileSync } from "fs";
import path from "path";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

function getSubscriptionId(deviceId: string): string | null {
  try {
    const dataPath = path.join(process.cwd(), "data", "credits.json");
    const raw = readFileSync(dataPath, "utf-8");
    const store = JSON.parse(raw);
    return store[deviceId]?.subscriptionId ?? null;
  } catch {
    return null;
  }
}

function getSubscriptionStatus(deviceId: string): string | null {
  try {
    const dataPath = path.join(process.cwd(), "data", "credits.json");
    const raw = readFileSync(dataPath, "utf-8");
    const store = JSON.parse(raw);
    return store[deviceId]?.subscriptionStatus ?? null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const { deviceId } = await req.json();

  if (!deviceId) {
    return NextResponse.json({ error: "deviceId is required" }, { status: 400 });
  }

  const subscriptionId = getSubscriptionId(deviceId);
  const status = getSubscriptionStatus(deviceId);

  if (!subscriptionId || status !== "active") {
    return NextResponse.json({ error: "有効なサブスクリプションが見つかりません" }, { status: 404 });
  }

  // 期間終了時にキャンセル（即時停止ではなく当月末まで利用可能）
  await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });

  setSubscription(deviceId, subscriptionId, "canceled");

  return NextResponse.json({ success: true });
}
