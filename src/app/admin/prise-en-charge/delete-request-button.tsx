"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { deleteRemoteCareRequest } from "./actions";

export function DeleteRequestButton({ requestId }: { requestId: string }) {
  const [isPending, startTransition] = useTransition();
  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={isPending}
      onClick={() => {
        if (confirm("Supprimer cette demande ?")) {
          startTransition(() => deleteRemoteCareRequest(requestId));
        }
      }}
    >
      Supprimer
    </Button>
  );
}
