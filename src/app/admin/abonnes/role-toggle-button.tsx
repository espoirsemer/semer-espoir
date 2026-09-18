"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, ShieldOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { setProfileRole } from "./actions";

export function RoleToggleButton({
  profileId,
  role,
}: {
  profileId: string;
  role: "admin" | "parent";
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (role === "admin") {
    return (
      <div className="flex flex-col items-end gap-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isPending}
          onClick={() => {
            if (!confirm("Retirer les droits administrateur à ce compte ?")) return;
            setError(null);
            startTransition(async () => {
              const result = await setProfileRole(profileId, "parent");
              if (result.error) setError(result.error);
              else router.refresh();
            });
          }}
        >
          <ShieldOff className="size-4" />
          Rétrograder en parent
        </Button>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isPending}
        onClick={() => {
          if (
            !confirm(
              "Nommer ce parent administrateur ? Il aura alors accès à tout le panel admin.",
            )
          )
            return;
          setError(null);
          startTransition(async () => {
            const result = await setProfileRole(profileId, "admin");
            if (result.error) setError(result.error);
            else router.refresh();
          });
        }}
      >
        <ShieldCheck className="size-4" />
        Nommer administrateur
      </Button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
