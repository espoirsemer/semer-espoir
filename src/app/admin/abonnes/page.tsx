import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function AdminAbonnesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Abonnés</h1>
        <p className="text-muted-foreground">
          Rechercher un parent, consulter son dashboard enfant (Tier VIP).
        </p>
      </div>
      <Input placeholder="Rechercher un parent par nom ou e-mail…" disabled className="max-w-sm" />
      <Card>
        <CardHeader>
          <Badge variant="secondary" className="w-fit">Module 5 — supervision clinique</Badge>
          <CardTitle className="mt-2">Liste des parents &amp; accès au journal VIP</CardTitle>
          <CardDescription>
            Liste des `profiles` avec recherche, clic vers
            `/admin/abonnes/[parentId]` pour visualiser en lecture seule le
            journal de bord des enfants dont le parent est Tier 3 — déjà
            restreint par la policy RLS « admin lit les enfants des abonnés
            VIP ».
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
