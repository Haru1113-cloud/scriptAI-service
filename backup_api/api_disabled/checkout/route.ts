import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const PLAN_CONFIG = {
  pro: {
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
    mode: "payment" as const,
    credits: 50,
  },
  max: {
    priceId: process.env.STRIPE_MAX_PRICE_ID!,
    mode: "subscription" as const,
    credits: null, // unlimited while subscribed
  },
} as const;

export async function POST(req: NextRequest) {
  const { deviceId, plan } = await req.json();

  if (!deviceId || !plan) {
    return NextResponse.json({ error: "deviceId and plan are required" }, { status: 400 });
  }

  if (!(plan in PLAN_CONFIG)) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const config = PLAN_CONFIG[plan as keyof typeof PLAN_CONFIG];
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: config.mode,
    line_items: [{ price: config.priceId, quantity: 1 }],
    metadata: {
      deviceId,
      plan,
    },
    subscription_data:
      config.mode === "subscription"
        ? { metadata: { deviceId } }
        : undefined,
    success_url: `${baseUrl}?success=true`,
    cancel_url: `${baseUrl}?canceled=true`,
  });

  return NextResponse.json({ url: session.url });
}
