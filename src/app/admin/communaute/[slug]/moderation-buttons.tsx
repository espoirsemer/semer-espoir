"use client";

import { useTransition } from "react";
import { Pin, PinOff, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { togglePin, deleteMessage } from "../actions";

export function ModerationButtons({
  messageId,
  pinned,
  slug,
}: {
  messageId: string;
  pinned: boolean;
  slug: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex gap-1">
      <Button
        variant="ghost"
        size="sm"
        disabled={isPending}
        onClick={() => startTransition(() => togglePin(messageId, pinned, slug))}
      >
        {pinned ? <PinOff className="size-4" /> : <Pin className="size-4" />}
        {pinned ? "Désépingler" : "Épingler"}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        disabled={isPending}
        onClick={() => {
          if (confirm("Supprimer ce message ?")) {
            startTransition(() => deleteMessage(messageId, slug));
          }
        }}
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
}
