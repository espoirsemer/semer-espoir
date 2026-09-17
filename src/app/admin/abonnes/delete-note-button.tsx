"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteChildNote } from "./actions";

export function DeleteNoteButton({ noteId, parentId }: { noteId: string; parentId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (confirm("Supprimer cette note ?")) {
          startTransition(() => deleteChildNote(noteId, parentId));
        }
      }}
      aria-label="Supprimer la note"
      className="text-muted-foreground hover:text-destructive disabled:opacity-50"
    >
      <Trash2 className="size-3.5" />
    </button>
  );
}
