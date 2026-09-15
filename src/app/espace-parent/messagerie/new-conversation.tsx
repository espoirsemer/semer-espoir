"use client";

import { useActionState, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { searchParents, startConversation, type SearchState } from "./actions";

const initialState: SearchState = { results: [] };

export function NewConversation() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(searchParents, initialState);
  const [isNavigating, startTransition] = useTransition();

  function handleSelect(parentId: string) {
    startTransition(async () => {
      const conversationId = await startConversation(parentId);
      setOpen(false);
      router.push(`/espace-parent/messagerie/${conversationId}`);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>Nouvelle conversation</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Écrire à un parent</DialogTitle>
          <DialogDescription>
            Recherchez un parent par son nom pour démarrer une conversation
            privée.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="flex gap-2">
          <Input name="q" placeholder="Nom du parent…" autoFocus />
          <Button type="submit" variant="outline" disabled={isPending}>
            {isPending ? "..." : "Chercher"}
          </Button>
        </form>

        <div className="max-h-64 space-y-1 overflow-y-auto">
          {state.results.length === 0 && !isPending && (
            <p className="py-2 text-sm text-muted-foreground">
              Lancez une recherche pour trouver un parent.
            </p>
          )}
          {state.results.map((parent) => (
            <button
              key={parent.id}
              type="button"
              disabled={isNavigating}
              onClick={() => handleSelect(parent.id)}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm hover:bg-accent disabled:opacity-50"
            >
              <span className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <UserRound className="size-4" />
              </span>
              {parent.full_name ?? "Parent"}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
