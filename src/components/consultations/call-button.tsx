"use client";

import { useTransition } from "react";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

// Salle Jitsi Meet gratuite, sans compte ni clé API — le nom de salle est
// dérivé de l'identifiant du parent, donc stable pour les deux parties : peu
// importe qui clique sur "Appeler" en premier, elles se retrouvent dans la
// même salle. Réutilise le même principe que les Lives Q&A.
function callUrlFor(parentId: string) {
  return `https://meet.jit.si/semer-espoir-consult-${parentId}`;
}

export function CallButton({
  parentId,
  onCall,
}: {
  parentId: string;
  onCall: (body: string) => void | Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    const url = callUrlFor(parentId);
    window.open(url, "_blank", "noopener,noreferrer");
    startTransition(() => onCall(`📞 Appel démarré — rejoignez sur : ${url}`));
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={isPending}
      onClick={handleClick}
      className="shrink-0"
    >
      <Phone className="size-4" />
      Appeler
    </Button>
  );
}
