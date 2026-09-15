"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createCategory } from "./actions";

export function CategoryForm() {
  const [state, formAction, isPending] = useActionState(createCategory, null);

  return (
    <form action={formAction} className="flex items-start gap-2">
      <Input name="name" placeholder="Nouvelle catégorie (ex. Sommeil)" required />
      <Button type="submit" variant="outline" disabled={isPending}>
        {isPending ? "..." : "Ajouter"}
      </Button>
      {state && state !== "success" && (
        <p className="text-sm text-destructive">{state}</p>
      )}
    </form>
  );
}
