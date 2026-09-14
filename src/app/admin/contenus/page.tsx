import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdminContenusPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Gestion des contenus</h1>
        <p className="text-muted-foreground">
          Uploader des vidéos, ajouter des PDF, les classer par catégories.
        </p>
      </div>
      <Card>
        <CardHeader>
          <Badge variant="secondary" className="w-fit">Module 5 — à construire</Badge>
          <CardTitle className="mt-2">Interface d&apos;upload</CardTitle>
          <CardDescription>
            Upload vers Supabase Storage + écriture dans `content_items` /
            `content_categories` (RLS : écriture réservée au rôle admin).
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
