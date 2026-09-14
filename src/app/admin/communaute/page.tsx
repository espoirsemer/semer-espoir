import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdminCommunautePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Modération de la communauté</h1>
        <p className="text-muted-foreground">
          Épingler, supprimer, gérer les salons de discussion.
        </p>
      </div>
      <Card>
        <CardHeader>
          <Badge variant="secondary" className="w-fit">Module 5 — à construire</Badge>
          <CardTitle className="mt-2">Outils de modération</CardTitle>
          <CardDescription>
            Actions sur `community_messages` (pinned, suppression) et gestion
            des `community_channels`, déjà autorisées pour le rôle admin par
            les policies RLS.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
