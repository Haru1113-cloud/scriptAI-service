import { NextRequest, NextResponse } from "next/server";
import { getCredits, initDevice, isRegistered, hasActiveSubscription } from "@/lib/credits";

export async function GET(req: NextRequest) {
  const deviceId = req.nextUrl.searchParams.get("deviceId");
  if (!deviceId) {
    return NextResponse.json({ error: "deviceId is required" }, { status: 400 });
  }
  const credits = getCredits(deviceId);
  const subscribed = hasActiveSubscription(deviceId);
  return NextResponse.json({ credits: credits === -1 ? 0 : credits, subscribed });
}

export async function POST(req: NextRequest) {
  const { deviceId } = await req.json();
  if (!deviceId) {
    return NextResponse.json({ error: "deviceId is required" }, { status: 400 });
  }
  const alreadyRegistered = isRegistered(deviceId);
  if (!alreadyRegistered) {
    initDevice(deviceId);
  }
  const credits = getCredits(deviceId);
  const subscribed = hasActiveSubscription(deviceId);
  return NextResponse.json({ credits, subscribed, isNew: !alreadyRegistered });
}
