"use client";

import { useTransition } from "react";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

// Salle Jitsi Meet gratuite, sans compte ni clé API — le nom de salle est
// dérivé d'un identifiant stable (parent pour une conversation 1:1, canal
// pour un groupe), donc peu importe qui clique sur "Appeler" en premier,
// tout le monde se retrouve dans la même salle. Réutilise le même principe
// que les Lives Q&A.
function callUrlFor(roomId: string) {
  return `https://meet.jit.si/semer-espoir-${roomId}`;
}

export function CallButton({
  roomId,
  onCall,
  label = "Appeler",
}: {
  roomId: string;
  onCall: (body: string) => void | Promise<void>;
  label?: string;
}) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    const url = callUrlFor(roomId);
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
      {label}
    </Button>
  );
}
