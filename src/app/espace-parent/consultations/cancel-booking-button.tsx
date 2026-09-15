"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { cancelBooking } from "./actions";

export function CancelBookingButton({ bookingId }: { bookingId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={isPending}
      onClick={() => {
        if (confirm("Annuler cette consultation ?")) {
          startTransition(() => cancelBooking(bookingId));
        }
      }}
    >
      Annuler
    </Button>
  );
}
