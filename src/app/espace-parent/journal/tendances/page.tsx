import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { Child, JournalEntry } from "@/types/database.types";
import { AnxietyTrendChart, TriggerFrequencyChart } from "./trend-charts";

export default async function TendancesPage({
  searchParams,
}: {
  searchParams: Promise<{ child?: string }>;
}) {
  const profile = await requireProfile();
  const { child: childParam } = await searchParams;
  const supabase = await createClient();

  const { data: children } = await supabase
    .from("children")
    .select("*")
    .eq("parent_id", profile.id)
    .order("created_at");

  const list = (children as Child[] | null) ?? [];

  if (list.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Tendances</h1>
        <Card>
          <CardHeader>
            <CardTitle>Aucune donnée pour l&apos;instant</CardTitle>
            <CardDescription>
              Ajoutez le profil de votre enfant et remplissez le journal de
              bord pour voir apparaître des tendances ici.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const selectedChild = list.find((c) => c.id === childParam) ?? list[0];
  const since = new Date();
  since.setDate(since.getDate() - 30);

  const { data: entries } = await supabase
    .from("journal_entries")
    .select("*")
    .eq("child_id", selectedChild.id)
    .gte("entry_date", since.toISOString().slice(0, 10))
    .order("entry_date");

  const journalEntries = (entries as JournalEntry[] | null) ?? [];

  const trendData = journalEntries.map((e) => ({
    date: new Date(e.entry_date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
    }),
    niveau: e.anxiety_level,
  }));

  const triggerCounts: Record<string, number> = {};
  for (const entry of journalEntries) {
    for (const trigger of entry.triggers) {
      triggerCounts[trigger] = (triggerCounts[trigger] ?? 0) + 1;
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Tendances — {selectedChild.first_name}</h1>
          <p className="text-muted-foreground">
            Évolution de l&apos;anxiété et des déclencheurs sur les 30 derniers
            jours.
          </p>
        </div>
        <Link
          href="/espace-parent/journal"
          className={buttonVariants({ variant: "outline" })}
        >
          Retour au journal
        </Link>
      </div>

      {list.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {list.map((child) => (
            <Link
              key={child.id}
              href={`/espace-parent/journal/tendances?child=${child.id}`}
              className={cn(
                buttonVariants({
                  variant: child.id === selectedChild.id ? "default" : "outline",
                  size: "sm",
                }),
              )}
            >
              {child.first_name}
            </Link>
          ))}
        </div>
      )}

      {journalEntries.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Pas encore d&apos;entrée pour {selectedChild.first_name}</CardTitle>
            <CardDescription>
              Remplissez le journal de bord quelques jours pour voir la
              tendance se dessiner.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Niveau d&apos;anxiété</CardTitle>
              <CardDescription>Échelle de 1 (calme) à 5 (crise)</CardDescription>
            </CardHeader>
            <CardContent>
              <AnxietyTrendChart data={trendData} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Déclencheurs les plus fréquents</CardTitle>
              <CardDescription>Nombre de jours où chaque facteur a été coché</CardDescription>
            </CardHeader>
            <CardContent>
              <TriggerFrequencyChart counts={triggerCounts} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
