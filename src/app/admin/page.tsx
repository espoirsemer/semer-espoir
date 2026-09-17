import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { getPricingPlans } from "@/lib/get-pricing-plans";
import type { SubscriptionTier } from "@/types/database.types";
import { PlanForm } from "./plan-form";

export default async function AdminAccueil() {
  const supabase = await createClient();
  const [{ data: profiles }, plans] = await Promise.all([
    supabase.from("profiles").select("role, subscription_tier"),
    getPricingPlans(),
  ]);

  const list = (profiles as { role: string; subscription_tier: SubscriptionTier | null }[] | null) ?? [];
  const parents = list.filter((p) => p.role === "parent");
  const activeSubscribers = parents.filter((p) => p.subscription_tier != null);
  const plan = plans[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Vue Business</h1>
        <p className="text-muted-foreground">
          Indicateurs clés et prix de l&apos;abonnement.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardDescription>Parents inscrits</CardDescription>
            <CardTitle className="text-3xl">{parents.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Abonnés actifs</CardDescription>
            <CardTitle className="text-3xl">{activeSubscribers.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="max-w-md">
        <h2 className="mb-3 text-lg font-medium">Abonnement</h2>
        {plan && <PlanForm plan={plan} />}
      </div>
    </div>
  );
}
