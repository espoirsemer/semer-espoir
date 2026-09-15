"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { deleteContentItem, deleteCategory } from "./actions";

export function DeleteItemButton({
  itemId,
  storagePath,
}: {
  itemId: string;
  storagePath: string;
}) {
  const [isPending, startTransition] = useTransition();
  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={isPending}
      onClick={() => {
        if (confirm("Supprimer cette ressource ?")) {
          startTransition(() => deleteContentItem(itemId, storagePath));
        }
      }}
    >
      Supprimer
    </Button>
  );
}

export function DeleteCategoryButton({ categoryId }: { categoryId: string }) {
  const [isPending, startTransition] = useTransition();
  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={isPending}
      onClick={() => {
        if (confirm("Supprimer cette catégorie ? Les ressources associées seront déclassées.")) {
          startTransition(() => deleteCategory(categoryId));
        }
      }}
    >
      Supprimer
    </Button>
  );
}
