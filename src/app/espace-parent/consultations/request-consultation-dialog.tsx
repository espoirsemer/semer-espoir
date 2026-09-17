"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Child } from "@/types/database.types";
import { requestConsultation } from "./actions";

export function RequestConsultationDialog({ kids }: { kids: Child[] }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(requestConsultation, null);

  if (state === "success" && open) {
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>Demander un rendez-vous</DialogTrigger>
      <DialogContent>
        <form action={formAction}>
          <DialogHeader>
            <DialogTitle>Demander un rendez-vous</DialogTitle>
            <DialogDescription>
              Choisissez le jour et l&apos;heure qui vous conviennent — la spécialiste confirmera dès que possible.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" name="date" type="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="start_time">Heure</Label>
                <Input id="start_time" name="start_time" type="time" required />
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
