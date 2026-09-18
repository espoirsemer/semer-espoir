"use client";

import { useState, useTransition } from "react";
import { SmilePlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleReaction } from "@/lib/community/actions";
import { QUICK_EMOJIS } from "@/lib/community/emojis";

export function Reactions({
  messageId,
  channelSlug,
  counts,
  myReaction,
}: {
  messageId: string;
  channelSlug: string;
  counts: Record<string, number>;
  myReaction: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();

  function react(emoji: string) {
    setOpen(false);
    startTransition(() => toggleReaction(messageId, emoji, channelSlug));
  }

  const activeEmojis = Object.entries(counts).filter(([, n]) => n > 0);

  return (
    <div className="relative flex flex-wrap items-center gap-1">
      {activeEmojis.map(([emoji, count]) => (
        <button
          key={emoji}
          type="button"
          onClick={() => react(emoji)}
          className={cn(
            "flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs transition-colors",
            myReaction === emoji
              ? "border-amber-400/50 bg-amber-500/15"
              : "border-border/60 bg-background hover:bg-accent",
          )}
        >
          {emoji} {count}
        </button>
      ))}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-center rounded-full p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
        aria-label="Ajouter une réaction"
      >
        <SmilePlus className="size-3.5" />
      </button>

      {open && (
        <div className="absolute bottom-full left-0 z-10 mb-1 flex gap-1 rounded-full border border-border/60 bg-popover p-1.5 shadow-md">
          {QUICK_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => react(emoji)}
              className="rounded-full p-1 text-lg transition-transform hover:scale-125"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
