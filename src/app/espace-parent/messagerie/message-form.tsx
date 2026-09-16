"use client";

import { useActionState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { sendMessageToSpecialist } from "./actions";

export function MessageForm() {
  const [state, formAction, isPending] = useActionState(sendMessageToSpecialist, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state === "success") {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="flex gap-2">
      <Textarea name="body" placeholder="Écrivez votre message à la spécialiste…" rows={2} required />
      <Button type="submit" disabled={isPending} className="self-end">
        {isPending ? "Envoi..." : "Envoyer"}
      </Button>
      {state && state !== "success" && (
        <p className="text-sm text-destructive">{state}</p>
      )}
    </form>
  );
}
