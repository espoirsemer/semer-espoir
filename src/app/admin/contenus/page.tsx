import { PlayCircle, FileText } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import type { ContentCategory, ContentItem } from "@/types/database.types";
import { ContentForm } from "./content-form";
import { CategoryForm } from "./category-form";
import { DeleteItemButton, DeleteCategoryButton } from "./delete-buttons";

export default async function AdminContenusPage() {
  const supabase = await createClient();
  const [{ data: categories }, { data: items }] = await Promise.all([
    supabase.from("content_categories").select("*").order("name"),
    supabase.from("content_items").select("*").order("created_at", { ascending: false }),
  ]);

  const categoryList = (categories as ContentCategory[] | null) ?? [];
  const itemList = (items as ContentItem[] | null) ?? [];
  const categoryName = (id: string | null) =>
    categoryList.find((c) => c.id === id)?.name ?? "Sans catégorie";

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Gestion des contenus</h1>
          <p className="text-muted-foreground">
            Uploader des vidéos, ajouter des PDF, les classer par catégories.
          </p>
        </div>
        <ContentForm categories={categoryList} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Catégories</CardTitle>
          <CardDescription>Utilisées pour classer les ressources du Hub.</CardDescription>
        </CardHeader>
        <div className="space-y-3 px-6 pb-6">
          <CategoryForm />
          {categoryList.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {categoryList.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center gap-1 rounded-full border border-border/60 py-1 pr-1 pl-3 text-sm"
                >
                  {cat.name}
                  <DeleteCategoryButton categoryId={cat.id} />
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      <div className="space-y-3">
        <h2 className="text-lg font-medium">Ressources ({itemList.length})</h2>
        {itemList.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Aucune ressource</CardTitle>
              <CardDescription>
                Ajoutez votre première vidéo ou PDF avec le bouton ci-dessus.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {itemList.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      {item.type === "video" ? (
                        <PlayCircle className="size-4" />
                      ) : (
                        <FileText className="size-4" />
                      )}
                      <Badge variant="secondary">{categoryName(item.category_id)}</Badge>
                    </div>
                    <DeleteItemButton itemId={item.id} storagePath={item.storage_path} />
                  </div>
                  <CardTitle>{item.title}</CardTitle>
                  {item.description && (
                    <CardDescription>{item.description}</CardDescription>
                  )}
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
