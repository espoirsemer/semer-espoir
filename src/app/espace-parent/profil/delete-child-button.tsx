"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { deleteChild } from "./actions";

export function DeleteChildButton({ childId }: { childId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={isPending}
      onClick={() => {
        if (confirm("Supprimer ce profil enfant et son journal de bord ?")) {
          startTransition(() => deleteChild(childId));
        }
      }}
    >
      Supprimer
    </Button>
  );
}
