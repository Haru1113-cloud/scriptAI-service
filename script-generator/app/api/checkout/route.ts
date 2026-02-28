import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const PRICE_IDS = {
  pro: process.env.STRIPE_PRO_PRICE_ID!,
  max: process.env.STRIPE_MAX_PRICE_ID!,
};

export async function POST(request: NextRequest) {
  const { deviceId, plan } = await request.json();

  if (!deviceId || !plan || !(plan in PRICE_IDS)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ price: PRICE_IDS[plan as "pro" | "max"], quantity: 1 }],
      mode: plan === "max" ? "subscription" : "payment",
      success_url: `${baseUrl}?checkout=success&plan=${plan}`,
      cancel_url: `${baseUrl}/cancel`,
      metadata: { deviceId, plan },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
