import { Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getRemoteCarePricing } from "@/lib/get-remote-care-pricing";
import type { Child, RemoteCareRequest } from "@/types/database.types";
import { RequestRemoteCareDialog } from "./request-remote-care-dialog";
import { CancelRequestButton } from "./cancel-request-button";

const CONDITION_LABELS: Record<string, string> = {
  autisme: "Autisme",
  imc: "IMC (infirmité motrice cérébrale)",
};

const CONDITION_FEATURES: Record<string, string[]> = {
  autisme: ["Livres pour nutrition", "Massage"],
  imc: ["Livres pour nutrition", "Massage", "Langage (apprendre à parler)"],
};

export default async function PriseEnChargePage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const [{ data: children }, { data: requests }, pricing] = await Promise.all([
    supabase.from("children").select("*").eq("parent_id", profile.id),
    supabase
      .from("remote_care_requests")
      .select("*")
      .eq("parent_id", profile.id)
      .order("created_at", { ascending: false }),
    getRemoteCarePricing(),
  ]);

  const childList = (children as Child[] | null) ?? [];
  const childNameById = new Map(childList.map((c) => [c.id, c.first_name]));
  const requestList = (requests as RemoteCareRequest[] | null) ?? [];

  const formattedAutisme = new Intl.NumberFormat("fr-FR").format(pricing.fee_autisme);
  const formattedImc = new Intl.NumberFormat("fr-FR").format(pricing.fee_imc);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Prise en charge à distance</h1>
        <p className="text-muted-foreground">
          Un accompagnement personnalisé avec la spécialiste, à distance,
          tarifé selon la condition de votre enfant.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm font-medium">Autisme</p>
            <p className="mt-1 text-2xl font-semibold">
              {formattedAutisme} {pricing.currency}
            </p>
            <ul className="mt-4 space-y-2">
              {CONDITION_FEATURES.autisme.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm font-medium">IMC (infirmité motrice cérébrale)</p>
            <p className="mt-1 text-2xl font-semibold">
              {formattedImc} {pricing.currency}
            </p>
            <ul className="mt-4 space-y-2">
              {CONDITION_FEATURES.imc.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <RequestRemoteCareDialog kids={childList} pricing={pricing} />

      <div className="space-y-3">
        <h2 className="text-lg font-medium">Mes demandes</h2>
        {requestList.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Vous n&apos;avez pas encore demandé de prise en charge à distance.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {requestList.map((request) => (
              <Card key={request.id}>
                <CardContent className="flex items-start justify-between gap-3 pt-6">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium">
                        {CONDITION_LABELS[request.condition]}
                      </p>
                      <Badge variant={request.status === "confirmed" ? "default" : "secondary"}>
                        {request.status === "confirmed" ? "Confirmé" : "En attente"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Intl.NumberFormat("fr-FR").format(request.amount)} {request.currency}
                      {request.child_id &&
                        ` — ${childNameById.get(request.child_id) ?? "enfant"}`}
                    </p>
                    {request.notes && (
                      <p className="text-sm italic text-muted-foreground">{request.notes}</p>
                    )}
                  </div>
                  {request.status === "pending" && (
                    <CancelRequestButton requestId={request.id} />
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
