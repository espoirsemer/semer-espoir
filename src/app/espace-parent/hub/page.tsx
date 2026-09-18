import { PlayCircle, FileText } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { ContentCategory, ContentItem } from "@/types/database.types";
import { CompleteToggle } from "./complete-toggle";

export default async function HubPage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const [{ data: categories }, { data: items }, { data: progress }] = await Promise.all([
    supabase.from("content_categories").select("*").order("name"),
    supabase.from("content_items").select("*").order("created_at"),
    supabase
      .from("content_progress")
      .select("content_item_id")
      .eq("profile_id", profile.id),
  ]);

  const categoryList = (categories as ContentCategory[] | null) ?? [];
  const itemList = (items as ContentItem[] | null) ?? [];
  const completedIds = new Set(
    (progress as { content_item_id: string }[] | null)?.map((p) => p.content_item_id) ?? [],
  );

  const signedUrls = new Map<string, string>();
  await Promise.all(
    itemList.map(async (item) => {
      const { data } = await supabase.storage
        .from("contenu")
        .createSignedUrl(item.storage_path, 60 * 60);
      if (data?.signedUrl) signedUrls.set(item.id, data.signedUrl);
    }),
  );

  const uncategorized = itemList.filter((i) => !i.category_id);
  const groups = [
    ...categoryList.map((cat) => ({
      category: cat,
      items: itemList.filter((i) => i.category_id === cat.id),
    })),
    ...(uncategorized.length > 0
      ? [{ category: null, items: uncategorized }]
      : []),
  ].filter((g) => g.items.length > 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Hub de contenu</h1>
        <p className="text-muted-foreground">
          Vidéothèque et boîte à outils de la spécialiste.
        </p>
      </div>

      {groups.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Aucun contenu pour l&apos;instant</CardTitle>
            <CardDescription>
              La spécialiste n&apos;a pas encore ajouté de vidéos ou de
              ressources. Revenez bientôt.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        groups.map((group) => (
          <div key={group.category?.id ?? "autres"} className="space-y-4">
            <h2 className="text-lg font-medium">
              {group.category?.name ?? "Autres ressources"}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {group.items.map((item) => {
                const url = signedUrls.get(item.id);
                const completed = completedIds.has(item.id);
                return (
                  <Card key={item.id}>
                    <CardHeader>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        {item.type === "video" ? (
                          <PlayCircle className="size-4" />
                        ) : (
                          <FileText className="size-4" />
                        )}
                        <span className="text-xs uppercase tracking-wide">
                          {item.type === "video" ? "Vidéo" : "PDF"}
                        </span>
                      </div>
                      <CardTitle>{item.title}</CardTitle>
                      {item.description && (
                        <CardDescription>{item.description}</CardDescription>
                      )}
                    </CardHeader>
                    {item.type === "video" && url ? (
                      <video controls className="w-full px-6" src={url} />
                    ) : url ? (
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 text-sm text-amber-400 underline underline-offset-4"
                      >
                        Télécharger le PDF
                      </a>
                    ) : null}
                    <div className="p-6 pt-4">
                      <CompleteToggle contentItemId={item.id} completed={completed} />
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
