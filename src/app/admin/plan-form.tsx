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
import type { SubscriptionPlan } from "@/types/database.types";
import { updatePlan } from "./plan-actions";

export function PlanForm({ plan }: { plan: SubscriptionPlan }) {
  const [state, formAction, isPending] = useActionState(updatePlan, null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{plan.name}</CardTitle>
        <CardDescription>Prix et lien de paiement affichés sur la landing page</CardDescription>
      </CardHeader>
      <form action={formAction}>
        <input type="hidden" name="key" value={plan.key} />
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor={`price-${plan.key}`}>Prix mensuel</Label>
              <Input
                id={`price-${plan.key}`}
                name="price_amount"
                type="number"
                min="0"
                step="1"
                placeholder="ex. 15000"
                defaultValue={plan.price_amount ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`currency-${plan.key}`}>Devise</Label>
              <Input
                id={`currency-${plan.key}`}
                name="price_currency"
                defaultValue={plan.price_currency}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`link-${plan.key}`}>Lien de paiement externe</Label>
            <Input
              id={`link-${plan.key}`}
              name="payment_link"
              type="url"
              placeholder="https://..."
              defaultValue={plan.payment_link ?? ""}
            />
            <p className="text-xs text-muted-foreground">
              Si renseigné, le bouton &laquo;&nbsp;Rejoindre la
              communauté&nbsp;&raquo; de la landing page y renvoie
              directement (nouvel onglet). Sinon, il renvoie vers la page
              d&apos;inscription.
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
