"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Sans infrastructure de temps réel (Postgres Realtime), on simule un salon
// qui vit : la vue se rafraîchit périodiquement pour faire apparaître les
// nouveaux messages/réactions et refléter sans délai un verrouillage décidé
// par la spécialiste, même si l'onglet était déjà ouvert.
export function AutoRefresh({ intervalMs = 5000 }: { intervalMs?: number }) {
  const router = useRouter();

  useEffect(() => {
    const id = setInterval(() => router.refresh(), intervalMs);
    return () => clearInterval(id);
  }, [router, intervalMs]);

  return null;
}
