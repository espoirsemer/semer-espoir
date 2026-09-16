"use client";

import { useActionState, useRef, useEffect } from "react";
import { SendHorizontal } from "lucide-react";
import { postMessage } from "@/lib/community/actions";

export function MessageForm({
  channelId,
  channelSlug,
  parentMessageId,
  placeholder = "Écrivez un message…",
  compact = false,
}: {
  channelId: string;
  channelSlug: string;
  parentMessageId?: string;
  placeholder?: string;
  compact?: boolean;
}) {
  const [state, formAction, isPending] = useActionState(postMessage, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state === "success") {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-1.5">
      <input type="hidden" name="channel_id" value={channelId} />
      <input type="hidden" name="channel_slug" value={channelSlug} />
      {parentMessageId && (
        <input type="hidden" name="parent_message_id" value={parentMessageId} />
      )}
      <div className="flex items-end gap-2">
        <textarea
          name="body"
          placeholder={placeholder}
          rows={1}
          required
          className="max-h-32 flex-1 resize-none rounded-3xl border border-border/60 bg-background px-4 py-2.5 text-sm shadow-sm outline-none focus:border-amber-400"
        />
        <button
          type="submit"
          disabled={isPending}
          aria-label="Envoyer"
          className="flex shrink-0 items-center justify-center rounded-full bg-amber-500 text-white transition-colors hover:bg-amber-600 disabled:opacity-60"
          style={{ width: compact ? 34 : 40, height: compact ? 34 : 40 }}
        >
          <SendHorizontal className={compact ? "size-4" : "size-4.5"} />
        </button>
      </div>
      {state && state !== "success" && (
        <p className="px-2 text-xs text-destructive">{state}</p>
      )}
    </form>
  );
}
