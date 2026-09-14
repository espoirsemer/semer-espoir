import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe/server";
import { createAdminClient } from "@/lib/supabase/server";
import type { SubscriptionTierKey } from "@/lib/stripe/config";

// Synchronise Stripe -> profiles.subscription_tier (module 6).
export async function POST(request: Request) {
  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Signature manquante" }, { status: 400 });
  }

  let event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Signature invalide";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const supabase = createAdminClient();

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const subscription = event.data.object;
      const priceId = subscription.items.data[0]?.price.id;
      const tier = priceIdToTier(priceId);

      if (tier) {
        await supabase
          .from("profiles")
          .update({ subscription_tier: tier })
          .eq("stripe_customer_id", subscription.customer as string);
      }
      break;
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      await supabase
        .from("profiles")
        .update({ subscription_tier: null })
        .eq("stripe_customer_id", subscription.customer as string);
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}

function priceIdToTier(priceId: string | undefined): SubscriptionTierKey | null {
  if (!priceId) return null;
  if (priceId === process.env.STRIPE_PRICE_TIER_1) return "tier_1";
  if (priceId === process.env.STRIPE_PRICE_TIER_2) return "tier_2";
  if (priceId === process.env.STRIPE_PRICE_TIER_3) return "tier_3";
  return null;
}
