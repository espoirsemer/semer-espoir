"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CalendarPlus, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { activateSubscription, suspendSubscription } from "./actions";

export function SubscriptionActions({
  profileId,
  hasSubscription,
}: {
  profileId: string;
  hasSubscription: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isPending}
          onClick={() => {
            setError(null);
            startTransition(async () => {
              const result = await activateSubscription(profileId);
              if (result.error) setError(result.error);
              else router.refresh();
            });
          }}
        >
          <CalendarPlus className="size-4" />
          {hasSubscription ? "Renouveler (1 mois)" : "Activer l'abonnement (1 mois)"}
        </Button>
        {hasSubscription && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={() => {
              if (!confirm("Suspendre l'abonnement de ce parent immédiatement ?")) return;
              setError(null);
              startTransition(async () => {
                const result = await suspendSubscription(profileId);
                if (result.error) setError(result.error);
                else router.refresh();
              });
            }}
          >
            <Ban className="size-4" />
            Suspendre
          </Button>
        )}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
