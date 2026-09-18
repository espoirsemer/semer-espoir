"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { cancelRemoteCareRequest } from "./actions";

export function CancelRequestButton({ requestId }: { requestId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={isPending}
      onClick={() => {
        if (confirm("Annuler cette demande de prise en charge ?")) {
          startTransition(() => cancelRemoteCareRequest(requestId));
        }
      }}
    >
      Annuler
    </Button>
  );
}
