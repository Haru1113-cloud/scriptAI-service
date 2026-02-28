import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { addCredits, setSubscription } from "@/lib/credits";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.CheckoutSession;
      const deviceId = session.metadata?.deviceId;
      const plan = session.metadata?.plan;

      if (!deviceId || !plan) break;

      if (plan === "pro") {
        addCredits(deviceId, 50);
      } else if (plan === "max" && session.subscription) {
        setSubscription(deviceId, session.subscription as string, "active");
        addCredits(deviceId, 300);
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const deviceId = subscription.metadata?.deviceId;
      if (deviceId) {
        setSubscription(deviceId, subscription.id, "canceled");
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
