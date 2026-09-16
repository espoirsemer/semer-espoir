"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

const STORAGE_KEY = "semer-espoir:community:last-seen";
const POLL_MS = 15000;

// Pas d'infrastructure de push/e-mail : on prévient les deux côtés (parents
// et spécialiste) d'un nouveau message communauté par un toast in-app, en
// comparant le dernier message connu à un repère stocké dans le navigateur.
export function CommunityNotifier({ profileId }: { profileId: string }) {
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);

  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    async function seedIfEmpty() {
      if (localStorage.getItem(STORAGE_KEY)) return;
      const { data } = await supabase
        .from("community_messages")
        .select("created_at")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (data) localStorage.setItem(STORAGE_KEY, data.created_at);
    }

    async function poll() {
      const { data } = await supabase
        .from("community_messages")
        .select("author_id, body, created_at")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (cancelled || !data) return;

      if (data.author_id === profileId) {
        localStorage.setItem(STORAGE_KEY, data.created_at);
        return;
      }

      const lastSeen = localStorage.getItem(STORAGE_KEY);
      if (lastSeen && new Date(data.created_at).getTime() <= new Date(lastSeen).getTime()) {
        return;
      }
      localStorage.setItem(STORAGE_KEY, data.created_at);

      // On n'affiche pas de toast si on regarde déjà la communauté.
      if (pathnameRef.current?.includes("/communaute")) return;

      toast("Nouveau message dans la communauté", {
        description: data.body.length > 80 ? `${data.body.slice(0, 80)}…` : data.body,
      });
    }

    seedIfEmpty();
    const id = setInterval(poll, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [profileId]);

  return null;
}
