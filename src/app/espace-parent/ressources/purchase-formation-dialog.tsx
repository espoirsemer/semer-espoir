"use client";

import { useActionState, useState } from "react";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { ResourceFormation } from "@/types/database.types";
import { purchaseFormation } from "./actions";

export function PurchaseFormationDialog({ formation }: { formation: ResourceFormation }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(purchaseFormation, null);

  if (state === "success" && open) {
    setOpen(false);
  }

  const formattedAmount = new Intl.NumberFormat("fr-FR").format(formation.price_amount);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="mt-4 w-full" />}>Acheter</DialogTrigger>
      <DialogContent>
        <form action={formAction}>
          <input type="hidden" name="formation_key" value={formation.key} />
          <DialogHeader>
            <DialogTitle>{formation.name}</DialogTitle>
            <DialogDescription>
              Réglez les frais de la formation ({formattedAmount} {formation.price_currency}) avant
              l&apos;envoi de votre demande.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="rounded-lg border border-amber-400/30 bg-amber-500/10 p-4">
              <p className="text-sm font-medium">
                {formation.name} : {formattedAmount} {formation.price_currency}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Réglez ce montant via le lien ci-dessous, puis confirmez pour envoyer votre demande.
              </p>
              {formation.payment_link ? (
                <a
                  href={formation.payment_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700"
                >
                  <CreditCard className="size-4" />
                  Payer {formattedAmount} {formation.price_currency}
                </a>
              ) : (
                <p className="mt-3 text-sm text-destructive">
                  Le lien de paiement n&apos;est pas encore configuré. Contactez la
                  spécialiste pour connaître les modalités de règlement.
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment_reference">Référence de paiement (optionnel)</Label>
              <Input
                id="payment_reference"
                name="payment_reference"
                placeholder="ex. ID de transaction Mobile Money"
              />
            </div>
            <label className="flex items-start gap-2 text-sm">
              <Checkbox name="payment_confirmed" required className="mt-0.5" />
              Je confirme avoir réglé les frais de la formation {formation.name} (
              {formattedAmount} {formation.price_currency}).
            </label>
            {state && state !== "success" && (
              <p className="text-sm text-destructive">{state}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Envoi..." : "Envoyer la demande"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
