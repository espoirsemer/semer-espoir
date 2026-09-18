"use client";

import { useActionState, useRef, useState } from "react";
import { CreditCard, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { cn } from "@/lib/utils";
import type { Child, RemoteCareCondition, RemoteCarePricing } from "@/types/database.types";
import { requestRemoteCare } from "./actions";

const CONDITION_FEATURES: Record<RemoteCareCondition, string[]> = {
  autisme: ["Livres pour nutrition", "Massage"],
  imc: ["Livres pour nutrition", "Massage", "Langage (apprendre à parler)"],
};

export function RequestRemoteCareDialog({
  kids,
  pricing,
}: {
  kids: Child[];
  pricing: RemoteCarePricing;
}) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"details" | "payment">("details");
  const [condition, setCondition] = useState<RemoteCareCondition>("autisme");
  const [state, formAction, isPending] = useActionState(requestRemoteCare, null);
  const formRef = useRef<HTMLFormElement>(null);

  if (state === "success" && open) {
    setOpen(false);
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setStep("details");
      setCondition("autisme");
    }
  }

  function goToPayment() {
    if (formRef.current?.reportValidity()) {
      setStep("payment");
    }
  }

  const amount = condition === "autisme" ? pricing.fee_autisme : pricing.fee_imc;
  const formattedAmount = new Intl.NumberFormat("fr-FR").format(amount);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button />}>Demander une prise en charge</DialogTrigger>
      <DialogContent>
        <form ref={formRef} action={formAction}>
          <DialogHeader>
            <DialogTitle>Prise en charge à distance</DialogTitle>
            <DialogDescription>
              {step === "details"
                ? "Indiquez la condition de l'enfant pour connaître le tarif applicable."
                : `Réglez les frais de prise en charge (${formattedAmount} ${pricing.currency}) avant l'envoi de votre demande.`}
            </DialogDescription>
          </DialogHeader>

          <div className={cn("space-y-4 py-2", step !== "details" && "hidden")}>
            <div className="space-y-2">
              <Label htmlFor="condition">Condition de l&apos;enfant</Label>
              <select
                id="condition"
                name="condition"
                value={condition}
                onChange={(e) => setCondition(e.target.value as RemoteCareCondition)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="autisme">
                  Autisme — {new Intl.NumberFormat("fr-FR").format(pricing.fee_autisme)} {pricing.currency}
                </option>
                <option value="imc">
                  IMC (infirmité motrice cérébrale) — {new Intl.NumberFormat("fr-FR").format(pricing.fee_imc)}{" "}
                  {pricing.currency}
                </option>
              </select>
              <ul className="space-y-1.5 pt-1">
                {CONDITION_FEATURES[condition].map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            {kids.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="child_id">Enfant concerné</Label>
                <select
                  id="child_id"
                  name="child_id"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="">Non précisé</option>
                  {kids.map((child) => (
                    <option key={child.id} value={child.id}>
                      {child.first_name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="notes">Précisions utiles pour la spécialiste</Label>
              <Textarea id="notes" name="notes" rows={3} />
            </div>
          </div>

          <div className={cn("space-y-4 py-2", step !== "payment" && "hidden")}>
            <div className="rounded-lg border border-amber-300 bg-amber-50/60 p-4 dark:border-amber-800 dark:bg-amber-950/20">
              <p className="text-sm font-medium">
                Frais de prise en charge ({condition === "autisme" ? "Autisme" : "IMC"}) :{" "}
                {formattedAmount} {pricing.currency}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Réglez ce montant via le lien ci-dessous, puis confirmez pour envoyer votre demande.
              </p>
              {pricing.payment_link ? (
                <a
                  href={pricing.payment_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700"
                >
                  <CreditCard className="size-4" />
                  Payer {formattedAmount} {pricing.currency}
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
              <Checkbox
                name="payment_confirmed"
                required={step === "payment"}
                className="mt-0.5"
              />
              Je confirme avoir réglé les frais de prise en charge de {formattedAmount}{" "}
              {pricing.currency}.
            </label>
            {state && state !== "success" && (
              <p className="text-sm text-destructive">{state}</p>
            )}
          </div>

          <DialogFooter>
            {step === "details" ? (
              <Button type="button" onClick={goToPayment}>
                Continuer vers le paiement
              </Button>
            ) : (
              <>
                <Button type="button" variant="outline" onClick={() => setStep("details")}>
                  Retour
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Envoi..." : "Envoyer la demande"}
                </Button>
              </>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
