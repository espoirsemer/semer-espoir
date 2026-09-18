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
import type { ResourceFormation } from "@/types/database.types";
import { updateResourceFormation } from "./actions";

export function FormationForm({ formation }: { formation: ResourceFormation }) {
  const [state, formAction, isPending] = useActionState(updateResourceFormation, null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{formation.name}</CardTitle>
        <CardDescription>Prix et lien de paiement affichés dans Ressources</CardDescription>
      </CardHeader>
      <form action={formAction}>
        <input type="hidden" name="key" value={formation.key} />
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`name-${formation.key}`}>Nom de la formation</Label>
            <Input
              id={`name-${formation.key}`}
              name="name"
              defaultValue={formation.name}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor={`price-${formation.key}`}>Prix</Label>
              <Input
                id={`price-${formation.key}`}
                name="price_amount"
                type="number"
                min="0"
                step="1"
                defaultValue={formation.price_amount}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`currency-${formation.key}`}>Devise</Label>
              <Input
                id={`currency-${formation.key}`}
                name="price_currency"
                defaultValue={formation.price_currency}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`link-${formation.key}`}>Lien de paiement externe</Label>
            <Input
              id={`link-${formation.key}`}
              name="payment_link"
              type="url"
              placeholder="https://..."
              defaultValue={formation.payment_link ?? ""}
            />
            <p className="text-xs text-muted-foreground">
              Tant qu&apos;aucun lien n&apos;est renseigné, les parents ne pourront
              pas confirmer de paiement pour cette formation.
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
              <Check className="size-4 text-amber-600 dark:text-amber-400" />
              Enregistré
            </span>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
