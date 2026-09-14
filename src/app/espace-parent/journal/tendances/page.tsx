import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function TendancesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Tendances</h1>
        <p className="text-muted-foreground">
          Évolution de l&apos;anxiété et des déclencheurs sur le mois.
        </p>
      </div>
      <Card>
        <CardHeader>
          <Badge variant="secondary" className="w-fit">Module 4 — dashboard graphique</Badge>
          <CardTitle className="mt-2">Courbe d&apos;anxiété &amp; déclencheurs fréquents</CardTitle>
          <CardDescription>
            Graphiques (Recharts, déjà installé) construits à partir de
            `journal_entries` : courbe de tendance mensuelle et diagramme des
            déclencheurs les plus fréquents.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
