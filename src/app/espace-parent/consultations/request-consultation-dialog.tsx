"use client";

import { useActionState, useRef, useState } from "react";
import { CreditCard } from "lucide-react";
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
import type { Child, ConsultationFee } from "@/types/database.types";
import { requestConsultation } from "./actions";

export function RequestConsultationDialog({
  kids,
  fee,
}: {
  kids: Child[];
  fee: ConsultationFee;
}) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"details" | "payment">("details");
  const [state, formAction, isPending] = useActionState(requestConsultation, null);
  const formRef = useRef<HTMLFormElement>(null);

  if (state === "success" && open) {
    setOpen(false);
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) setStep("details");
  }

  function goToPayment() {
    if (formRef.current?.reportValidity()) {
      setStep("payment");
    }
  }

  const formattedAmount = new Intl.NumberFormat("fr-FR").format(fee.amount);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button />}>Demander un rendez-vous</DialogTrigger>
      <DialogContent>
        <form ref={formRef} action={formAction}>
          <DialogHeader>
            <DialogTitle>Demander un rendez-vous</DialogTitle>
            <DialogDescription>
              {step === "details"
                ? "Choisissez le jour et l'heure qui vous conviennent — la spécialiste confirmera dès que possible."
                : `Réglez les frais de consultation (${formattedAmount} ${fee.currency}) avant l'envoi de votre demande.`}
            </DialogDescription>
          </DialogHeader>

          <div className={cn("space-y-4 py-2", step !== "details" && "hidden")}>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" name="date" type="date" required={step === "details"} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="start_time">Heure</Label>
                <Input id="start_time" name="start_time" type="time" required={step === "details"} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Durée (minutes)</Label>
              <Input id="duration" name="duration" type="number" defaultValue={30} min={15} step={15} />
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
              <Label htmlFor="notes">Ce que vous aimeriez aborder</Label>
              <Textarea id="notes" name="notes" rows={3} />
            </div>
          </div>

          <div className={cn("space-y-4 py-2", step !== "payment" && "hidden")}>
            <div className="rounded-lg border border-amber-300 bg-amber-50/60 p-4 dark:border-amber-800 dark:bg-amber-950/20">
              <p className="text-sm font-medium">
                Frais de consultation : {formattedAmount} {fee.currency}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Réglez ce montant via le lien ci-dessous, puis confirmez pour envoyer votre demande.
              </p>
              {fee.payment_link ? (
                <a
                  href={fee.payment_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700"
                >
                  <CreditCard className="size-4" />
                  Payer {formattedAmount} {fee.currency}
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
              Je confirme avoir réglé les frais de consultation de {formattedAmount}{" "}
              {fee.currency}.
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
