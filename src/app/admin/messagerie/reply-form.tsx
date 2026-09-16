"use client";

import { useActionState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { replyToParent } from "./actions";

export function ReplyForm({ parentId }: { parentId: string }) {
  const [state, formAction, isPending] = useActionState(replyToParent, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state === "success") {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="flex gap-2">
      <input type="hidden" name="parent_id" value={parentId} />
      <Textarea name="body" placeholder="Répondre au parent…" rows={2} required />
      <Button type="submit" disabled={isPending} className="self-end">
        {isPending ? "Envoi..." : "Envoyer"}
      </Button>
      {state && state !== "success" && (
        <p className="text-sm text-destructive">{state}</p>
      )}
    </form>
  );
}
