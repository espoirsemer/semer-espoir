"use client";

import { useTransition } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toggleProgress } from "./actions";

export function CompleteToggle({
  contentItemId,
  completed,
}: {
  contentItemId: string;
  completed: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      size="sm"
      variant={completed ? "default" : "outline"}
      disabled={isPending}
      onClick={() => startTransition(() => toggleProgress(contentItemId, completed))}
      className={cn(completed && "bg-emerald-600 hover:bg-emerald-700")}
    >
      <Check className="size-4" />
      {completed ? "Terminé" : "Marquer comme terminé"}
    </Button>
  );
}
