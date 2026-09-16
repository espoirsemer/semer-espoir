"use client";

import { useTransition } from "react";
import { Lock, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleChannelLock } from "../actions";

export function LockToggle({
  channelId,
  locked,
  slug,
}: {
  channelId: string;
  locked: boolean;
  slug: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant={locked ? "default" : "outline"}
      size="sm"
      disabled={isPending}
      onClick={() => startTransition(() => toggleChannelLock(channelId, locked, slug))}
    >
      {locked ? <Unlock className="size-4" /> : <Lock className="size-4" />}
      {locked ? "Déverrouiller le canal" : "Verrouiller le canal"}
    </Button>
  );
}
