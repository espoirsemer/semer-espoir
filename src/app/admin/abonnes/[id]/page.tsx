import Link from "next/link";
import { notFound } from "next/navigation";
import { NotebookText } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import type { Child, ChildNote, JournalEntry, Profile } from "@/types/database.types";
import { AnxietyTrendChart, TriggerFrequencyChart } from "@/app/espace-parent/journal/tendances/trend-charts";
import { ChildNoteForm } from "../child-note-form";
import { DeleteNoteButton } from "../delete-note-button";

const TIER_LABELS: Record<string, string> = {
  tier_1: "Abonnement",
  tier_2: "Guidance",
  tier_3: "VIP",
};

export default async function AdminAbonneDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ booking?: string; child?: string }>;
}) {
  const { id } = await params;
  const { booking: bookingIdParam, child: childIdParam } = await searchParams;
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

  const notesByChild = new Map<string, ChildNote[]>();
  if (childList.length > 0) {
    const { data: notes } = await supabase
      .from("child_notes")
      .select("*")
      .in("child_id", childList.map((c) => c.id))
      .order("created_at", { ascending: false });

    for (const note of (notes as ChildNote[] | null) ?? []) {
      const arr = notesByChild.get(note.child_id) ?? [];
      arr.push(note);
      notesByChild.set(note.child_id, arr);
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
          const notes = notesByChild.get(child.id) ?? [];
          const highlighted = childIdParam === child.id;

          return (
            <Card key={child.id} id={`enfant-${child.id}`} className={highlighted ? "ring-2 ring-amber-400" : undefined}>
              <CardHeader>
                <CardTitle>{child.first_name}</CardTitle>
                <CardDescription>
                  {child.language_level && `Langage : ${child.language_level}`}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!isVip ? (
                  <p className="text-sm text-muted-foreground">
                    L&apos;analyse du journal de bord par la spécialiste
                    n&apos;est pas encore incluse dans l&apos;abonnement
                    actuel.
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

                <div className="space-y-3 border-t border-border/60 pt-4">
                  <div className="flex items-center gap-2">
                    <NotebookText className="size-4 text-amber-400" />
                    <p className="text-sm font-medium">Dossier clinique</p>
                  </div>

                  {notes.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Aucune note pour l&apos;instant.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {notes.map((note) => (
                        <div
                          key={note.id}
                          className="flex items-start justify-between gap-3 rounded-lg border border-border/60 bg-muted/40 px-3 py-2"
                        >
                          <div>
                            <p className="text-sm whitespace-pre-wrap">{note.body}</p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {new Date(note.created_at).toLocaleString("fr-FR", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                          <DeleteNoteButton noteId={note.id} parentId={id} />
                        </div>
                      ))}
                    </div>
                  )}

                  <ChildNoteForm
                    childId={child.id}
                    parentId={id}
                    bookingId={highlighted ? bookingIdParam : undefined}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
