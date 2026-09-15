"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createChannel } from "./actions";

export function ChannelForm() {
  const [state, formAction, isPending] = useActionState(createChannel, null);

  return (
    <form action={formAction} className="flex flex-wrap items-start gap-2">
      <Input name="name" placeholder="Nom du canal (ex. Sommeil)" required className="max-w-56" />
      <Input name="description" placeholder="Description (optionnel)" className="max-w-72" />
      <Button type="submit" variant="outline" disabled={isPending}>
        {isPending ? "..." : "Créer le canal"}
      </Button>
      {state && state !== "success" && (
        <p className="w-full text-sm text-destructive">{state}</p>
      )}
    </form>
  );
}
