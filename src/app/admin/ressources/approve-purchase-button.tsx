"use client";

import { useTransition } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { approveFormationPurchase } from "./actions";

export function ApprovePurchaseButton({ purchaseId }: { purchaseId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={isPending}
      onClick={() => startTransition(() => approveFormationPurchase(purchaseId))}
    >
      <Check className="size-4" />
      Approuver
    </Button>
  );
}
