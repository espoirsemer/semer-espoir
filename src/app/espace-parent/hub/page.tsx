import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function HubPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Hub de contenu</h1>
        <p className="text-muted-foreground">
          Vidéothèque et boîte à outils PDF de la spécialiste.
        </p>
      </div>
      <Card>
        <CardHeader>
          <Badge variant="secondary" className="w-fit">Module 2 — à construire</Badge>
          <CardTitle className="mt-2">Lecteur vidéo &amp; ressources</CardTitle>
          <CardDescription>
            Lecture des vidéos via URLs signées Supabase Storage, téléchargement
            des PDF et suivi de progression (« Marquer comme terminé »)
            viendront ici, alimentés par les tables `content_items` et
            `content_progress`.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
