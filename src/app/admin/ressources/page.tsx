import { FileText, PlayCircle, UserRound } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getAuthorNames } from "@/lib/get-author-names";
import { getResourceFormations } from "@/lib/get-resource-formations";
import type { ResourceFormationContent, ResourcePurchase } from "@/types/database.types";
import { FormationForm } from "./formation-form";
import { ContentForm } from "./content-form";
import { DeleteContentButton } from "./delete-content-button";
import { ApprovePurchaseButton } from "./approve-purchase-button";
import { DeletePurchaseButton } from "./delete-purchase-button";

export default async function AdminRessourcesPage() {
  await requireAdmin();
  const supabase = await createClient();

  const [formations, { data: purchases }, { data: content }] = await Promise.all([
    getResourceFormations(),
    supabase.from("resource_purchases").select("*").order("created_at", { ascending: false }),
    supabase.from("resource_formation_content").select("*").order("created_at"),
  ]);

  const purchaseList = (purchases as ResourcePurchase[] | null) ?? [];
  const formationByKey = new Map(formations.map((f) => [f.key, f]));
  const names = await getAuthorNames(supabase, [...new Set(purchaseList.map((p) => p.parent_id))]);
  const contentList = (content as ResourceFormationContent[] | null) ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Ressources</h1>
        <p className="text-muted-foreground">
          Tarifs des formations et demandes d&apos;inscription des parents.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {formations.map((formation) => {
          const items = contentList.filter((c) => c.formation_key === formation.key);
          return (
            <div key={formation.key} className="space-y-4">
              <FormationForm key={`${formation.key}-${formation.updated_at}`} formation={formation} />
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Contenu débloqué</CardTitle>
                  <CardDescription>
                    Visible une fois l&apos;inscription confirmée.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {items.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Aucun contenu ajouté.</p>
                  ) : (
                    <ul className="space-y-2">
                      {items.map((item) => (
                        <li
                          key={item.id}
                          className="flex items-center justify-between gap-2 rounded-md border border-border/60 px-3 py-2 text-sm"
                        >
                          <span className="flex items-center gap-2">
                            {item.type === "video" ? (
                              <PlayCircle className="size-3.5 text-muted-foreground" />
                            ) : (
                              <FileText className="size-3.5 text-muted-foreground" />
                            )}
                            {item.title}
                          </span>
                          <DeleteContentButton contentId={item.id} storagePath={item.storage_path} />
                        </li>
                      ))}
                    </ul>
                  )}
                  <ContentForm formationKey={formation.key} />
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-medium">Demandes ({purchaseList.length})</h2>
        {purchaseList.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune demande pour l&apos;instant.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {purchaseList.map((purchase) => (
              <Card key={purchase.id}>
                <CardContent className="flex items-start justify-between gap-3 pt-6">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-1.5 text-sm">
                      <UserRound className="size-3.5 text-muted-foreground" />
                      <span className="font-medium">{names.get(purchase.parent_id) ?? "Parent"}</span>
                      <Badge variant={purchase.status === "confirmed" ? "default" : "secondary"}>
                        {purchase.status === "confirmed" ? "Confirmé" : "En attente"}
                      </Badge>
                      <Badge variant={purchase.payment_confirmed ? "default" : "destructive"}>
                        {purchase.payment_confirmed
                          ? `Payé${purchase.payment_reference ? ` (${purchase.payment_reference})` : ""}`
                          : "Non payé"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formationByKey.get(purchase.formation_key)?.name ?? purchase.formation_key} —{" "}
                      {new Intl.NumberFormat("fr-FR").format(purchase.amount)} {purchase.currency}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    {purchase.status === "pending" && (
                      <ApprovePurchaseButton purchaseId={purchase.id} />
                    )}
                    <DeletePurchaseButton purchaseId={purchase.id} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
