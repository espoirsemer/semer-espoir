import { UserRound } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getAuthorNames } from "@/lib/get-author-names";
import { getRemoteCarePricing } from "@/lib/get-remote-care-pricing";
import type { Child, RemoteCareRequest } from "@/types/database.types";
import { RemoteCarePricingForm } from "./pricing-form";
import { ApproveRequestButton } from "./approve-request-button";
import { DeleteRequestButton } from "./delete-request-button";

const CONDITION_LABELS: Record<string, string> = {
  autisme: "Autisme",
  imc: "IMC (infirmité motrice cérébrale)",
};

export default async function AdminPriseEnChargePage() {
  await requireAdmin();
  const supabase = await createClient();

  const [{ data: requests }, pricing] = await Promise.all([
    supabase.from("remote_care_requests").select("*").order("created_at", { ascending: false }),
    getRemoteCarePricing(),
  ]);

  const requestList = (requests as RemoteCareRequest[] | null) ?? [];

  const childIds = [...new Set(requestList.map((r) => r.child_id).filter((id): id is string => !!id))];
  const { data: childrenData } = childIds.length
    ? await supabase.from("children").select("id, first_name").in("id", childIds)
    : { data: [] as Pick<Child, "id" | "first_name">[] };
  const childNameById = new Map(
    ((childrenData as Pick<Child, "id" | "first_name">[] | null) ?? []).map((c) => [c.id, c.first_name]),
  );

  const names = await getAuthorNames(supabase, [...new Set(requestList.map((r) => r.parent_id))]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Prise en charge à distance</h1>
        <p className="text-muted-foreground">
          Demandes d&apos;accompagnement personnalisé et tarifs selon la condition de l&apos;enfant.
        </p>
      </div>

      <div className="max-w-md">
        <RemoteCarePricingForm pricing={pricing} />
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-medium">Demandes ({requestList.length})</h2>
        {requestList.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune demande pour l&apos;instant.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {requestList.map((request) => (
              <Card key={request.id}>
                <CardContent className="flex items-start justify-between gap-3 pt-6">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-1.5 text-sm">
                      <UserRound className="size-3.5 text-muted-foreground" />
                      <span className="font-medium">{names.get(request.parent_id) ?? "Parent"}</span>
                      <Badge variant={request.status === "confirmed" ? "default" : "secondary"}>
                        {request.status === "confirmed" ? "Confirmé" : "En attente"}
                      </Badge>
                      <Badge variant={request.payment_confirmed ? "default" : "destructive"}>
                        {request.payment_confirmed
                          ? `Payé${request.payment_reference ? ` (${request.payment_reference})` : ""}`
                          : "Non payé"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {CONDITION_LABELS[request.condition]} —{" "}
                      {new Intl.NumberFormat("fr-FR").format(request.amount)} {request.currency}
                      {request.child_id &&
                        ` — ${childNameById.get(request.child_id) ?? "enfant"}`}
                    </p>
                    {request.notes && (
                      <p className="text-sm italic text-muted-foreground">{request.notes}</p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    {request.status === "pending" && (
                      <ApproveRequestButton requestId={request.id} />
                    )}
                    <DeleteRequestButton requestId={request.id} />
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
