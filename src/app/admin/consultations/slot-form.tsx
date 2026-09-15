"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSlot } from "./actions";

export function SlotForm() {
  const [state, formAction, isPending] = useActionState(createSlot, null);

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3">
      <div className="space-y-1.5">
        <Label htmlFor="date">Date</Label>
        <Input id="date" name="date" type="date" required className="w-40" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="start_time">Heure</Label>
        <Input id="start_time" name="start_time" type="time" required className="w-32" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="duration">Durée (min)</Label>
        <Input
          id="duration"
          name="duration"
          type="number"
          min="15"
          step="15"
          defaultValue={30}
          className="w-28"
        />
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? "..." : "Ajouter le créneau"}
      </Button>
      {state && state !== "success" && (
        <p className="w-full text-sm text-destructive">{state}</p>
      )}
    </form>
  );
}
