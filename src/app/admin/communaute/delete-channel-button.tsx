"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { deleteChannel } from "./actions";

export function DeleteChannelButton({ channelId }: { channelId: string }) {
  const [isPending, startTransition] = useTransition();
  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={isPending}
      onClick={(e) => {
        e.preventDefault();
        if (confirm("Supprimer ce canal et tous ses messages ?")) {
          startTransition(() => deleteChannel(channelId));
        }
      }}
    >
      Supprimer
    </Button>
  );
}
