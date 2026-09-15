import { createClient } from "@/lib/supabase/server";
import { PLAN_FEATURES, PLAN_ORDER } from "@/lib/pricing";
import type { SubscriptionPlan } from "@/types/database.types";

export async function getPricingPlans(): Promise<SubscriptionPlan[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("subscription_plans")
    .select("*")
    .order("key");

  const plans = (data as SubscriptionPlan[] | null) ?? [];

  // Garantit les 3 formules dans le bon ordre même si une ligne manque.
  return PLAN_ORDER.map(
    (key) =>
      plans.find((p) => p.key === key) ?? {
        key,
        name: PLAN_FEATURES[key].name,
        price_amount: null,
        price_currency: "FCFA",
        payment_link: null,
        updated_at: new Date(0).toISOString(),
      },
  );
}
