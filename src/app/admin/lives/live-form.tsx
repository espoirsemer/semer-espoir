"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createLive } from "./actions";

export function LiveForm() {
  const [state, formAction, isPending] = useActionState(createLive, null);

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="title">Titre</Label>
          <Input id="title" name="title" placeholder="ex. Live Q&A — Rentrée scolaire" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="meeting_url">Lien de visio (optionnel)</Label>
          <Input id="meeting_url" name="meeting_url" placeholder="Laisser vide pour générer une salle automatiquement" />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" rows={2} />
      </div>
      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="date">Date</Label>
          <Input id="date" name="date" type="date" required className="w-40" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="time">Heure</Label>
          <Input id="time" name="time" type="time" required className="w-32" />
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending ? "..." : "Programmer le Live"}
        </Button>
      </div>
      {state && state !== "success" && (
        <p className="text-sm text-destructive">{state}</p>
      )}
    </form>
  );
}
