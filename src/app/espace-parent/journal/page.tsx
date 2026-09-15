import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { Child, JournalEntry } from "@/types/database.types";
import { JournalForm } from "./journal-form";

export default async function JournalPage({
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
        <div>
          <h1 className="text-2xl font-semibold">Journal de bord</h1>
          <p className="text-muted-foreground">
            Formulaire quotidien — moins d&apos;une minute.
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Ajoutez d&apos;abord le profil de votre enfant</CardTitle>
            <CardDescription>
              Le journal de bord est associé au profil de votre enfant.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/espace-parent/profil"
              className={buttonVariants({ variant: "outline" })}
            >
              Créer un profil
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const selectedChild = list.find((c) => c.id === childParam) ?? list[0];
  const today = new Date().toISOString().slice(0, 10);

  const { data: existingEntry } = await supabase
    .from("journal_entries")
    .select("*")
    .eq("child_id", selectedChild.id)
    .eq("entry_date", today)
    .maybeSingle();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Journal de bord</h1>
          <p className="text-muted-foreground">
            Formulaire quotidien — moins d&apos;une minute.
          </p>
        </div>
        <Link
          href="/espace-parent/journal/tendances"
          className={buttonVariants({ variant: "outline" })}
        >
          Voir les tendances
        </Link>
      </div>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Entrée du {new Date().toLocaleDateString("fr-FR")}</CardTitle>
          <CardDescription>
            {existingEntry
              ? "Vous avez déjà noté cette journée — modifiez-la si besoin."
              : "Prenez trente secondes pour noter la journée."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <JournalForm
            kids={list}
            existingEntry={existingEntry as JournalEntry | null}
          />
        </CardContent>
      </Card>
    </div>
  );
}
