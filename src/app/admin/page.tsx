import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import type { SubscriptionTier } from "@/types/database.types";

const TIER_LABELS: Record<SubscriptionTier, string> = {
  tier_1: "Autonomie",
  tier_2: "Guidance",
  tier_3: "VIP",
};

export default async function AdminAccueil() {
  const supabase = await createClient();
  const { data: profiles } = await supabase
    .from("profiles")
    .select("role, subscription_tier");

  const list = (profiles as { role: string; subscription_tier: SubscriptionTier | null }[] | null) ?? [];
  const parents = list.filter((p) => p.role === "parent");
  const activeSubscribers = parents.filter((p) => p.subscription_tier != null);

  const byTier: Record<SubscriptionTier, number> = {
    tier_1: 0,
    tier_2: 0,
    tier_3: 0,
  };
  for (const p of activeSubscribers) {
    if (p.subscription_tier) byTier[p.subscription_tier]++;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Vue Business</h1>
        <p className="text-muted-foreground">
          Indicateurs clés : abonnés actifs, répartition par tier.
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
            <CardDescription>Abonnés actifs (tier payant)</CardDescription>
            <CardTitle className="text-3xl">{activeSubscribers.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-medium">Répartition par formule</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {(Object.keys(TIER_LABELS) as SubscriptionTier[]).map((tier) => (
            <Card key={tier}>
              <CardHeader>
                <CardDescription>{TIER_LABELS[tier]}</CardDescription>
                <CardTitle className="text-3xl">{byTier[tier]}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
