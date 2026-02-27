import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { addCredits, setSubscription, getDeviceBySubscriptionId } from "@/lib/credits";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook signature verification failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const deviceId = session.metadata?.deviceId;
      const plan = session.metadata?.plan;

      if (!deviceId) break;

      if (plan === "pro") {
        // One-time: add 50 credits
        addCredits(deviceId, 50);
      } else if (plan === "max" && session.subscription) {
        // Subscription: mark as active
        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription.id;
        setSubscription(deviceId, subscriptionId, "active");
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const deviceId =
        (subscription.metadata?.deviceId as string | undefined) ||
        getDeviceBySubscriptionId(subscription.id);

      if (deviceId) {
        setSubscription(deviceId, subscription.id, "canceled");
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const deviceId =
        (subscription.metadata?.deviceId as string | undefined) ||
        getDeviceBySubscriptionId(subscription.id);

      if (deviceId) {
        const status = subscription.status === "active" ? "active" : "canceled";
        setSubscription(deviceId, subscription.id, status);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
