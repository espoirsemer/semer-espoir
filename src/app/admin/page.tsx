import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { getPricingPlans } from "@/lib/get-pricing-plans";
import { getResourceFormations } from "@/lib/get-resource-formations";
import type { SubscriptionTier } from "@/types/database.types";
import { PlanForm } from "./plan-form";
import { RegistrationsChart } from "./registrations-chart";
import { RevenueChart } from "./revenue-chart";

const CHART_WINDOW_DAYS = 30;

const CONDITION_LABELS: Record<string, string> = {
  autisme: "Prise en charge à distance — Autisme",
  imc: "Prise en charge à distance — IMC",
};

export default async function AdminAccueil() {
  const supabase = await createClient();
  const since = new Date();
  since.setDate(since.getDate() - (CHART_WINDOW_DAYS - 1));
  since.setHours(0, 0, 0, 0);

  const [
    { data: profiles },
    plans,
    formations,
    { data: consultationFee },
    { data: consultationBookings },
    { data: remoteCareRequests },
    { data: resourcePurchases },
  ] = await Promise.all([
    supabase.from("profiles").select("role, subscription_tier, created_at"),
    getPricingPlans(),
    getResourceFormations(),
    supabase.from("consultation_fee").select("amount").single(),
    supabase.from("consultation_bookings").select("status, created_at, updated_at"),
    supabase.from("remote_care_requests").select("status, amount, condition, created_at, updated_at"),
    supabase.from("resource_purchases").select("status, amount, formation_key, created_at, updated_at"),
  ]);

  const list =
    (profiles as { role: string; subscription_tier: SubscriptionTier | null; created_at: string }[] | null) ?? [];
  const parents = list.filter((p) => p.role === "parent");
  const activeSubscribers = parents.filter((p) => p.subscription_tier != null);
  const plan = plans[0];

  const now = new Date();
  const newThisMonth = parents.filter((p) => {
    const d = new Date(p.created_at);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }).length;

  const bookings =
    (consultationBookings as { status: string; created_at: string; updated_at: string }[] | null) ?? [];
  const remoteCare =
    (remoteCareRequests as
      | { status: string; amount: number; condition: string; created_at: string; updated_at: string }[]
      | null) ?? [];
  const resources =
    (resourcePurchases as
      | { status: string; amount: number; formation_key: string; created_at: string; updated_at: string }[]
      | null) ?? [];
  const feeAmount = (consultationFee as { amount: number } | null)?.amount ?? 0;
  const formationByKey = new Map(formations.map((f) => [f.key, f]));

  const confirmedBookings = bookings.filter((b) => b.status === "confirmed");
  const confirmedRemoteCare = remoteCare.filter((r) => r.status === "confirmed");
  const confirmedResources = resources.filter((r) => r.status === "confirmed");

  const confirmedRevenue =
    confirmedBookings.length * feeAmount +
    confirmedRemoteCare.reduce((sum, r) => sum + r.amount, 0) +
    confirmedResources.reduce((sum, r) => sum + r.amount, 0);

  const pendingRequests =
    bookings.filter((b) => b.status === "pending").length +
    remoteCare.filter((r) => r.status === "pending").length +
    resources.filter((r) => r.status === "pending").length;

  // Inscriptions par jour ---------------------------------------------------
  const registrationBuckets = new Map<string, number>();
  for (let i = 0; i < CHART_WINDOW_DAYS; i++) {
    const d = new Date(since);
    d.setDate(d.getDate() + i);
    registrationBuckets.set(d.toISOString().slice(0, 10), 0);
  }
  for (const p of parents) {
    const key = p.created_at.slice(0, 10);
    if (registrationBuckets.has(key)) {
      registrationBuckets.set(key, (registrationBuckets.get(key) ?? 0) + 1);
    }
  }
  const registrationsData = [...registrationBuckets.entries()].map(([iso, count]) => ({
    date: new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }),
    count,
  }));

  // Revenus par jour (toutes ventes confirmées confondues) ------------------
  const revenueBuckets = new Map<string, { amount: number; sales: number }>();
  for (let i = 0; i < CHART_WINDOW_DAYS; i++) {
    const d = new Date(since);
    d.setDate(d.getDate() + i);
    revenueBuckets.set(d.toISOString().slice(0, 10), { amount: 0, sales: 0 });
  }
  function addRevenue(dateIso: string, amount: number) {
    const key = dateIso.slice(0, 10);
    const bucket = revenueBuckets.get(key);
    if (bucket) {
      bucket.amount += amount;
      bucket.sales += 1;
    }
  }
  for (const b of confirmedBookings) addRevenue(b.updated_at, feeAmount);
  for (const r of confirmedRemoteCare) addRevenue(r.updated_at, r.amount);
  for (const r of confirmedResources) addRevenue(r.updated_at, r.amount);
  const revenueData = [...revenueBuckets.entries()].map(([iso, { amount, sales }]) => ({
    date: new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }),
    amount,
    sales,
  }));

  // Ventes par produit --------------------------------------------------------
  const productSales = [
    {
      key: "consultations",
      name: "Consultations",
      count: confirmedBookings.length,
      amount: confirmedBookings.length * feeAmount,
    },
    ...(["autisme", "imc"] as const).map((condition) => {
      const items = confirmedRemoteCare.filter((r) => r.condition === condition);
      return {
        key: `remote-care-${condition}`,
        name: CONDITION_LABELS[condition],
        count: items.length,
        amount: items.reduce((sum, r) => sum + r.amount, 0),
      };
    }),
    ...formations.map((formation) => {
      const items = confirmedResources.filter((r) => r.formation_key === formation.key);
      return {
        key: `resource-${formation.key}`,
        name: formationByKey.get(formation.key)?.name ?? formation.key,
        count: items.length,
        amount: items.reduce((sum, r) => sum + r.amount, 0),
      };
    }),
  ]
    .filter((p) => p.count > 0)
    .sort((a, b) => b.amount - a.amount);

  const totalProductRevenue = productSales.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Vue Business</h1>
        <p className="text-muted-foreground">
          Indicateurs clés et prix de l&apos;abonnement.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
        <Card>
          <CardHeader>
            <CardDescription>Nouveaux ce mois-ci</CardDescription>
            <CardTitle className="text-3xl">{newThisMonth}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Demandes en attente</CardDescription>
            <CardTitle className="text-3xl">{pendingRequests}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardDescription>Revenus confirmés (abonnement non compris)</CardDescription>
          <CardTitle className="text-3xl">
            {new Intl.NumberFormat("fr-FR").format(confirmedRevenue)} FCFA
          </CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Revenus des 30 derniers jours</CardTitle>
          <CardDescription>
            Consultations, prise en charge à distance et ressources confirmées, par jour.
          </CardDescription>
        </CardHeader>
        <RevenueChart data={revenueData} />
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Inscriptions des 30 derniers jours</CardTitle>
          <CardDescription>Nombre de nouveaux parents par jour.</CardDescription>
        </CardHeader>
        <RegistrationsChart data={registrationsData} />
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ventes par service</CardTitle>
          <CardDescription>Répartition des revenus confirmés par service.</CardDescription>
        </CardHeader>
        <CardContent>
          {productSales.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune vente confirmée pour l&apos;instant.</p>
          ) : (
            <div className="divide-y divide-border/60">
              {productSales.map((product) => {
                const pct = totalProductRevenue > 0 ? Math.round((product.amount / totalProductRevenue) * 100) : 0;
                return (
                  <div key={product.key} className="flex items-center justify-between gap-3 py-3">
                    <div>
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {product.count} vente{product.count > 1 ? "s" : ""} · {pct}%
                      </p>
                    </div>
                    <p className="text-sm font-semibold">
                      {new Intl.NumberFormat("fr-FR").format(product.amount)} FCFA
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="max-w-md">
        <h2 className="mb-3 text-lg font-medium">Abonnement</h2>
        {plan && <PlanForm plan={plan} />}
      </div>
    </div>
  );
}
