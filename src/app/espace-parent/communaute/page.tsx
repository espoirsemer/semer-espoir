import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CommunautePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Communauté</h1>
        <p className="text-muted-foreground">
          Canaux thématiques : #alimentation, #sommeil, #scolarité, #petites-victoires…
        </p>
      </div>
      <Card>
        <CardHeader>
          <Badge variant="secondary" className="w-fit">Module 3 — à construire</Badge>
          <CardTitle className="mt-2">Fils de discussion &amp; réactions</CardTitle>
          <CardDescription>
            Liste des canaux (`community_channels`), messages avec réponses en
            fil et réactions (`community_messages`, `community_reactions`),
            en lecture seule pour le Tier 1 et publication active pour le
            Tier 2+. Les notifications de réponse passeront par Brevo.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
