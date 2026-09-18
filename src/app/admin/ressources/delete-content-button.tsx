"use client";

import { useTransition } from "react";
import { X } from "lucide-react";
import { deleteFormationContent } from "./actions";

export function DeleteContentButton({
  contentId,
  storagePath,
}: {
  contentId: string;
  storagePath: string;
}) {
  const [isPending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={isPending}
      aria-label="Supprimer ce contenu"
      onClick={() => {
        if (confirm("Supprimer ce contenu ?")) {
          startTransition(() => deleteFormationContent(contentId, storagePath));
        }
      }}
      className="text-muted-foreground hover:text-destructive disabled:opacity-50"
    >
      <X className="size-3.5" />
    </button>
  );
}
