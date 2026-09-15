"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { deleteLive } from "./actions";

export function DeleteLiveButton({ liveId }: { liveId: string }) {
  const [isPending, startTransition] = useTransition();
  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={isPending}
      onClick={() => {
        if (confirm("Annuler ce Live ?")) {
          startTransition(() => deleteLive(liveId));
        }
      }}
    >
      Supprimer
    </Button>
  );
}
