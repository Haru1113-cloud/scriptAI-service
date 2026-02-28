import { NextRequest, NextResponse } from "next/server";
import { initDevice, getCredits, hasActiveSubscription } from "@/lib/credits";

export async function POST(request: NextRequest) {
  const { deviceId } = await request.json();
  if (!deviceId) {
    return NextResponse.json({ error: "Missing deviceId" }, { status: 400 });
  }

  initDevice(deviceId);
  const credits = getCredits(deviceId);
  const subscribed = hasActiveSubscription(deviceId);

  return NextResponse.json({ credits, subscribed });
}
