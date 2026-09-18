import { PlayCircle, FileText } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getResourceFormations } from "@/lib/get-resource-formations";
import { getSignedAttachmentUrls } from "@/lib/get-signed-attachment-urls";
import type { ResourceFormationContent, ResourcePurchase } from "@/types/database.types";
import { PurchaseFormationDialog } from "./purchase-formation-dialog";
import { CancelPurchaseButton } from "./cancel-purchase-button";

export default async function RessourcesPage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const [formations, { data: purchases }] = await Promise.all([
    getResourceFormations(),
    supabase
      .from("resource_purchases")
      .select("*")
      .eq("parent_id", profile.id)
      .order("created_at", { ascending: false }),
  ]);

  const purchaseList = (purchases as ResourcePurchase[] | null) ?? [];
  const formationByKey = new Map(formations.map((f) => [f.key, f]));
  const confirmedKeys = [...new Set(purchaseList.filter((p) => p.status === "confirmed").map((p) => p.formation_key))];

  const { data: content } = confirmedKeys.length
    ? await supabase.from("resource_formation_content").select("*").in("formation_key", confirmedKeys)
    : { data: [] as ResourceFormationContent[] };
  const contentList = (content as ResourceFormationContent[] | null) ?? [];
  const contentUrls = await getSignedAttachmentUrls(
    contentList.map((c) => c.storage_path),
    "contenu",
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Ressources</h1>
        <p className="text-muted-foreground">
          Formations complètes animées par la spécialiste, à votre rythme.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {formations.map((formation) => (
          <Card key={formation.key}>
            <CardHeader>
              <CardTitle>{formation.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">
                {new Intl.NumberFormat("fr-FR").format(formation.price_amount)}{" "}
                {formation.price_currency}
              </p>
              <PurchaseFormationDialog formation={formation} />
            </CardContent>
          </Card>
        ))}
      </div>

      {confirmedKeys.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-medium">Mes formations débloquées</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {confirmedKeys.map((key) => {
              const items = contentList.filter((c) => c.formation_key === key);
              return (
                <Card key={key}>
                  <CardHeader>
                    <CardTitle className="text-base">{formationByKey.get(key)?.name ?? key}</CardTitle>
                    <CardDescription>
                      {items.length === 0
                        ? "Le contenu sera bientôt disponible."
                        : `${items.length} ressource${items.length > 1 ? "s" : ""}`}
                    </CardDescription>
                  </CardHeader>
                  {items.length > 0 && (
                    <CardContent className="space-y-2">
                      {items.map((item) => {
                        const url = contentUrls.get(item.storage_path);
                        return (
                          <div key={item.id}>
                            <div className="flex items-center gap-2 text-sm">
                              {item.type === "video" ? (
                                <PlayCircle className="size-3.5 text-muted-foreground" />
                              ) : (
                                <FileText className="size-3.5 text-muted-foreground" />
                              )}
                              <span>{item.title}</span>
                            </div>
                            {item.type === "video" && url ? (
                              <video controls className="mt-2 w-full rounded-md" src={url} />
                            ) : url ? (
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-1 inline-block text-sm text-amber-700 underline underline-offset-4 dark:text-amber-400"
                              >
                                Télécharger le PDF
                              </a>
                            ) : null}
                          </div>
                        );
                      })}
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h2 className="text-lg font-medium">Mes demandes</h2>
        {purchaseList.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Vous n&apos;avez pas encore demandé de formation.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {purchaseList.map((purchase) => (
              <Card key={purchase.id}>
                <CardContent className="flex items-start justify-between gap-3 pt-6">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium">
                        {formationByKey.get(purchase.formation_key)?.name ?? purchase.formation_key}
                      </p>
                      <Badge variant={purchase.status === "confirmed" ? "default" : "secondary"}>
                        {purchase.status === "confirmed" ? "Confirmé" : "En attente"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Intl.NumberFormat("fr-FR").format(purchase.amount)} {purchase.currency}
                    </p>
                  </div>
                  {purchase.status === "pending" && (
                    <CancelPurchaseButton purchaseId={purchase.id} />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
