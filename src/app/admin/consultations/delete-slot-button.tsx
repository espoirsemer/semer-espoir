"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { deleteSlot } from "./actions";

export function DeleteSlotButton({ slotId }: { slotId: string }) {
  const [isPending, startTransition] = useTransition();
  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={isPending}
      onClick={() => {
        if (confirm("Supprimer ce créneau ?")) {
          startTransition(() => deleteSlot(slotId));
        }
      }}
    >
      Supprimer
    </Button>
  );
}
