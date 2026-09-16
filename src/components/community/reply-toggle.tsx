"use client";

import { useState } from "react";
import { MessageForm } from "./message-form";

export function ReplyToggle({
  channelId,
  channelSlug,
  parentMessageId,
}: {
  channelId: string;
  channelSlug: string;
  parentMessageId: string;
}) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="px-1 text-xs text-muted-foreground hover:text-foreground hover:underline"
      >
        Répondre
      </button>
    );
  }

  return (
    <div className="w-full max-w-[80%] pt-0.5">
      <MessageForm
        channelId={channelId}
        channelSlug={channelSlug}
        parentMessageId={parentMessageId}
        placeholder="Répondre…"
        compact
      />
    </div>
  );
}
