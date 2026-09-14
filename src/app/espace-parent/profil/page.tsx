import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ProfilEnfantPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Profil de l&apos;enfant</h1>
        <p className="text-muted-foreground">
          Prénom, âge, niveau de langage, hypersensibilités sensorielles.
        </p>
      </div>
      <Card>
        <CardHeader>
          <Badge variant="secondary" className="w-fit">Module 1 — à construire</Badge>
          <CardTitle className="mt-2">Configuration du profil enfant</CardTitle>
          <CardDescription>
            Formulaire relié à la table `children` (déjà créée avec RLS :
            chaque parent ne voit que ses propres enfants).
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
