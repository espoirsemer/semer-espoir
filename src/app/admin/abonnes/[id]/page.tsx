import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import type { Child, JournalEntry, Profile } from "@/types/database.types";
import { AnxietyTrendChart, TriggerFrequencyChart } from "@/app/espace-parent/journal/tendances/trend-charts";

const TIER_LABELS: Record<string, string> = {
  tier_1: "Autonomie",
  tier_2: "Guidance",
  tier_3: "VIP",
};

export default async function AdminAbonneDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (!profile) notFound();

  const typedProfile = profile as Profile;
  const isVip = typedProfile.subscription_tier === "tier_3";

  const { data: children } = await supabase
    .from("children")
    .select("*")
    .eq("parent_id", id);

  const childList = (children as Child[] | null) ?? [];

  const since = new Date();
  since.setDate(since.getDate() - 30);

  const journalByChild = new Map<string, JournalEntry[]>();
  if (isVip && childList.length > 0) {
    const { data: entries } = await supabase
      .from("journal_entries")
      .select("*")
      .in("child_id", childList.map((c) => c.id))
      .gte("entry_date", since.toISOString().slice(0, 10))
      .order("entry_date");

    for (const entry of (entries as JournalEntry[] | null) ?? []) {
      const arr = journalByChild.get(entry.child_id) ?? [];
      arr.push(entry);
      journalByChild.set(entry.child_id, arr);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/abonnes"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Tous les abonnés
        </Link>
        <div className="mt-1 flex items-center gap-3">
          <h1 className="text-2xl font-semibold">
            {typedProfile.full_name ?? "Sans nom"}
          </h1>
          {typedProfile.subscription_tier ? (
            <Badge variant="secondary">{TIER_LABELS[typedProfile.subscription_tier]}</Badge>
          ) : (
            <Badge variant="outline">Sans abonnement</Badge>
          )}
        </div>
        <p className="text-muted-foreground">
          Inscrit le {new Date(typedProfile.created_at).toLocaleDateString("fr-FR")}
        </p>
      </div>

      {childList.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Aucun enfant renseigné</CardTitle>
            <CardDescription>
              Ce parent n&apos;a pas encore ajouté de profil enfant.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        childList.map((child) => {
          const entries = journalByChild.get(child.id) ?? [];
          const trendData = entries.map((e) => ({
            date: new Date(e.entry_date).toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "2-digit",
            }),
            niveau: e.anxiety_level,
          }));
          const triggerCounts: Record<string, number> = {};
          for (const e of entries) {
            for (const t of e.triggers) {
              triggerCounts[t] = (triggerCounts[t] ?? 0) + 1;
            }
          }

          return (
            <Card key={child.id}>
              <CardHeader>
                <CardTitle>{child.first_name}</CardTitle>
                <CardDescription>
                  {child.language_level && `Langage : ${child.language_level}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!isVip ? (
                  <p className="text-sm text-muted-foreground">
                    Le journal de bord n&apos;est visible que pour les abonnés
                    formule VIP.
                  </p>
                ) : entries.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Aucune entrée de journal sur les 30 derniers jours.
                  </p>
                ) : (
                  <div className="grid gap-4 lg:grid-cols-2">
                    <div>
                      <p className="mb-2 text-sm font-medium">Niveau d&apos;anxiété</p>
                      <AnxietyTrendChart data={trendData} />
                    </div>
                    <div>
                      <p className="mb-2 text-sm font-medium">Déclencheurs fréquents</p>
                      <TriggerFrequencyChart counts={triggerCounts} />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
