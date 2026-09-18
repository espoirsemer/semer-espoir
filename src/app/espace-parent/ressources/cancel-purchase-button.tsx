"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { cancelFormationPurchase } from "./actions";

export function CancelPurchaseButton({ purchaseId }: { purchaseId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={isPending}
      onClick={() => {
        if (confirm("Annuler cette demande ?")) {
          startTransition(() => cancelFormationPurchase(purchaseId));
        }
      }}
    >
      Annuler
    </Button>
  );
}
