import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdminAccueil() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Vue Business</h1>
        <p className="text-muted-foreground">
          Indicateurs clés : abonnés actifs, répartition par tier.
        </p>
      </div>
      <Card>
        <CardHeader>
          <Badge variant="secondary" className="w-fit">Module 5 — à construire</Badge>
          <CardTitle className="mt-2">KPIs abonnés</CardTitle>
          <CardDescription>
            Agrégation des `profiles.subscription_tier` (via le client
            service-role `createAdminClient`) pour afficher le nombre
            d&apos;abonnés actifs et leur répartition par offre.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
