"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { Child, JournalEntry } from "@/types/database.types";
import { TRIGGER_OPTIONS } from "./triggers";
import { saveJournalEntry } from "./actions";

const ANXIETY_LEVELS = [1, 2, 3, 4, 5] as const;
const today = new Date().toISOString().slice(0, 10);

export function JournalForm({
  kids,
  existingEntry,
}: {
  kids: Child[];
  existingEntry: JournalEntry | null;
}) {
  const [state, formAction, isPending] = useActionState(saveJournalEntry, null);

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="child_id">Enfant</Label>
        <select
          id="child_id"
          name="child_id"
          required
          defaultValue={existingEntry?.child_id ?? kids[0]?.id}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {kids.map((child) => (
            <option key={child.id} value={child.id}>
              {child.first_name}
            </option>
          ))}
        </select>
      </div>

      <input type="hidden" name="entry_date" value={existingEntry?.entry_date ?? today} />

      <div className="space-y-2">
        <Label>Niveau d&apos;anxiété aujourd&apos;hui</Label>
        <div className="flex gap-2">
          {ANXIETY_LEVELS.map((level) => (
            <label
              key={level}
              className={cn(
                "flex size-11 cursor-pointer items-center justify-center rounded-lg border text-sm font-medium transition-colors",
                "has-checked:border-amber-600 has-checked:bg-amber-600 has-checked:text-white",
                "border-border/60 hover:bg-muted",
              )}
            >
              <input
                type="radio"
                name="anxiety_level"
                value={level}
                defaultChecked={existingEntry?.anxiety_level === level}
                required
                className="sr-only"
              />
              {level}
            </label>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">1 = très calme, 5 = crise</p>
      </div>

      <div className="space-y-2">
        <Label>Facteurs déclencheurs</Label>
        <div className="flex flex-wrap gap-4">
          {TRIGGER_OPTIONS.map((trigger) => (
            <label key={trigger.key} className="flex items-center gap-2 text-sm">
              <Checkbox
                name={`trigger_${trigger.key}`}
                defaultChecked={existingEntry?.triggers.includes(trigger.key)}
              />
              {trigger.label}
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Réussites ou points de blocage</Label>
        <Textarea
          id="notes"
          name="notes"
          rows={3}
          placeholder="Ce qui s'est bien passé, ce qui a été difficile..."
          defaultValue={existingEntry?.notes ?? ""}
        />
      </div>

      {state && state !== "success" && (
        <p className="text-sm text-destructive">{state}</p>
      )}
      {state === "success" && (
        <p className="text-sm text-muted-foreground">
          Entrée enregistrée pour aujourd&apos;hui.
        </p>
      )}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Enregistrement..." : "Enregistrer"}
      </Button>
    </form>
  );
}
