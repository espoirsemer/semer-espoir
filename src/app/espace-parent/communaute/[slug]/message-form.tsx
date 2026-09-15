"use client";

import { useActionState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { postMessage } from "./actions";

export function MessageForm({
  channelId,
  channelSlug,
  parentMessageId,
  placeholder = "Écrivez votre message…",
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
    <form ref={formRef} action={formAction} className="space-y-2">
      <input type="hidden" name="channel_id" value={channelId} />
      <input type="hidden" name="channel_slug" value={channelSlug} />
      {parentMessageId && (
        <input type="hidden" name="parent_message_id" value={parentMessageId} />
      )}
      <Textarea
        name="body"
        placeholder={placeholder}
        rows={compact ? 2 : 3}
        required
      />
      {state && state !== "success" && (
        <p className="text-sm text-destructive">{state}</p>
      )}
      <Button type="submit" size={compact ? "sm" : "default"} disabled={isPending}>
        {isPending ? "Envoi..." : "Envoyer"}
      </Button>
    </form>
  );
}
