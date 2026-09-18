"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { deleteFormationPurchase } from "./actions";

export function DeletePurchaseButton({ purchaseId }: { purchaseId: string }) {
  const [isPending, startTransition] = useTransition();
  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={isPending}
      onClick={() => {
        if (confirm("Supprimer cette demande ?")) {
          startTransition(() => deleteFormationPurchase(purchaseId));
        }
      }}
    >
      Supprimer
    </Button>
  );
}
