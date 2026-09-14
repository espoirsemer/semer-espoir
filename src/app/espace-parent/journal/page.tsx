import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

export default function JournalPage() {
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
      <Card>
        <CardHeader>
          <Badge variant="secondary" className="w-fit">Module 4 — à construire</Badge>
          <CardTitle className="mt-2">Niveau d&apos;anxiété, déclencheurs, notes</CardTitle>
          <CardDescription>
            Formulaire quotidien (échelle 1–5, déclencheurs cochés, texte
            libre) écrivant dans `journal_entries`, avec contrainte
            d&apos;unicité par enfant et par jour déjà en place côté base.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
