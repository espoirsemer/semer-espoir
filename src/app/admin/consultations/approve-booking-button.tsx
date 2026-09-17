"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { approveBooking } from "./actions";

export function ApproveBookingButton({ bookingId }: { bookingId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          const error = await approveBooking(bookingId);
          if (error) toast.error(error);
        })
      }
    >
      <Check className="size-4" />
      Approuver
    </Button>
  );
}
