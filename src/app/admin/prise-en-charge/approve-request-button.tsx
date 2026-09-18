"use client";

import { useTransition } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { approveRemoteCareRequest } from "./actions";

export function ApproveRequestButton({ requestId }: { requestId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={isPending}
      onClick={() => startTransition(() => approveRemoteCareRequest(requestId))}
    >
      <Check className="size-4" />
      Approuver
    </Button>
  );
}
