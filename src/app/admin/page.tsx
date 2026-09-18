import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { getPricingPlans } from "@/lib/get-pricing-plans";
import type { SubscriptionTier } from "@/types/database.types";
import { PlanForm } from "./plan-form";
import { RegistrationsChart } from "./registrations-chart";

const REGISTRATIONS_WINDOW_DAYS = 30;

export default async function AdminAccueil() {
  const supabase = await createClient();
  const since = new Date();
  since.setDate(since.getDate() - (REGISTRATIONS_WINDOW_DAYS - 1));
  since.setHours(0, 0, 0, 0);

  const [
    { data: profiles },
    plans,
    { data: consultationFee },
    { data: consultationBookings },
    { data: remoteCareRequests },
    { data: resourcePurchases },
  ] = await Promise.all([
    supabase.from("profiles").select("role, subscription_tier, created_at"),
    getPricingPlans(),
    supabase.from("consultation_fee").select("amount").single(),
    supabase.from("consultation_bookings").select("status, created_at"),
    supabase.from("remote_care_requests").select("status, amount, created_at"),
    supabase.from("resource_purchases").select("status, amount, created_at"),
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

  const bookings = (consultationBookings as { status: string; created_at: string }[] | null) ?? [];
  const remoteCare = (remoteCareRequests as { status: string; amount: number; created_at: string }[] | null) ?? [];
  const resources = (resourcePurchases as { status: string; amount: number; created_at: string }[] | null) ?? [];
  const feeAmount = (consultationFee as { amount: number } | null)?.amount ?? 0;

  const confirmedRevenue =
    bookings.filter((b) => b.status === "confirmed").length * feeAmount +
    remoteCare.filter((r) => r.status === "confirmed").reduce((sum, r) => sum + r.amount, 0) +
    resources.filter((r) => r.status === "confirmed").reduce((sum, r) => sum + r.amount, 0);

  const pendingRequests =
    bookings.filter((b) => b.status === "pending").length +
    remoteCare.filter((r) => r.status === "pending").length +
    resources.filter((r) => r.status === "pending").length;

  const dayBuckets = new Map<string, number>();
  for (let i = 0; i < REGISTRATIONS_WINDOW_DAYS; i++) {
    const d = new Date(since);
    d.setDate(d.getDate() + i);
    dayBuckets.set(d.toISOString().slice(0, 10), 0);
  }
  for (const p of parents) {
    const key = p.created_at.slice(0, 10);
    if (dayBuckets.has(key)) {
      dayBuckets.set(key, (dayBuckets.get(key) ?? 0) + 1);
    }
  }
  const registrationsData = [...dayBuckets.entries()].map(([iso, count]) => ({
    date: new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }),
    count,
  }));

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
          <CardTitle className="text-base">Inscriptions des 30 derniers jours</CardTitle>
          <CardDescription>Nombre de nouveaux parents par jour.</CardDescription>
        </CardHeader>
        <RegistrationsChart data={registrationsData} />
      </Card>

      <div className="max-w-md">
        <h2 className="mb-3 text-lg font-medium">Abonnement</h2>
        {plan && <PlanForm plan={plan} />}
      </div>
    </div>
  );
}
