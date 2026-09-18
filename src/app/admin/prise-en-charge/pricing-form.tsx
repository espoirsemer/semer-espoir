"use client";

import { useActionState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import type { RemoteCarePricing } from "@/types/database.types";
import { updateRemoteCarePricing } from "./actions";

export function RemoteCarePricingForm({ pricing }: { pricing: RemoteCarePricing }) {
  const [state, formAction, isPending] = useActionState(updateRemoteCarePricing, null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tarifs de la prise en charge à distance</CardTitle>
        <CardDescription>
          Montant demandé au parent selon la condition de l&apos;enfant.
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="fee_autisme">Autisme</Label>
              <Input
                id="fee_autisme"
                name="fee_autisme"
                type="number"
                min="0"
                step="1"
                defaultValue={pricing.fee_autisme}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fee_imc">IMC</Label>
              <Input
                id="fee_imc"
                name="fee_imc"
                type="number"
                min="0"
                step="1"
                defaultValue={pricing.fee_imc}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency">Devise</Label>
            <Input id="currency" name="currency" defaultValue={pricing.currency} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="payment_link">Lien de paiement externe</Label>
            <Input
              id="payment_link"
              name="payment_link"
              type="url"
              placeholder="https://..."
              defaultValue={pricing.payment_link ?? ""}
            />
            <p className="text-xs text-muted-foreground">
              Le bouton &laquo;&nbsp;Payer&nbsp;&raquo; du formulaire de demande y
              renvoie (nouvel onglet). Tant qu&apos;aucun lien n&apos;est renseigné,
              les parents ne pourront pas confirmer de paiement.
            </p>
          </div>
          {state && state !== "success" && (
            <p className="text-sm text-destructive">{state}</p>
          )}
        </CardContent>
        <CardFooter className="flex items-center gap-3">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Enregistrement..." : "Enregistrer"}
          </Button>
          {state === "success" && !isPending && (
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Check className="size-4 text-amber-400" />
              Enregistré
            </span>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
