"use client";

import { useActionState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { addChildNote } from "./actions";

export function ChildNoteForm({
  childId,
  parentId,
  bookingId,
}: {
  childId: string;
  parentId: string;
  bookingId?: string;
}) {
  const [state, formAction, isPending] = useActionState(addChildNote, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state === "success") {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-2">
      <input type="hidden" name="child_id" value={childId} />
      <input type="hidden" name="parent_id" value={parentId} />
      {bookingId && <input type="hidden" name="booking_id" value={bookingId} />}
      <Textarea
        name="body"
        placeholder="Notez ici les informations utiles issues de la consultation…"
        rows={3}
        required
      />
      <div className="flex items-center gap-3">
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? "Enregistrement..." : "Enregistrer la note"}
        </Button>
        {state && state !== "success" && (
          <p className="text-sm text-destructive">{state}</p>
        )}
      </div>
    </form>
  );
}
