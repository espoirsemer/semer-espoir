"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
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
import { bookSlot } from "./actions";

export function BookSlotDialog({
  slotId,
  label,
  kids,
}: {
  slotId: string;
  label: string;
  kids: Child[];
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(bookSlot, null);

  if (state === "success" && open) {
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" />}>Réserver</DialogTrigger>
      <DialogContent>
        <form action={formAction}>
          <input type="hidden" name="slot_id" value={slotId} />
          <DialogHeader>
            <DialogTitle>Réserver ce créneau</DialogTitle>
            <DialogDescription>{label}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
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
              {isPending ? "Réservation..." : "Confirmer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
