"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

const PENDING_KEY = "semer-espoir:consultations:last-seen-pending";
const CONFIRMED_KEY = "semer-espoir:consultations:last-seen-confirmed";
const POLL_MS = 15000;

// Même principe que CommunityNotifier : pas d'infrastructure de push/e-mail,
// on compare l'état le plus récent à un repère stocké dans le navigateur et
// on prévient par un toast in-app — la spécialiste des nouvelles demandes,
// le parent dès que son rendez-vous est confirmé.
export function ConsultationNotifier({
  profileId,
  role,
}: {
  profileId: string;
  role: "admin" | "parent";
}) {
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);

  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    async function seed() {
      if (role === "admin") {
        if (localStorage.getItem(PENDING_KEY)) return;
        const { data } = await supabase
          .from("consultation_bookings")
          .select("created_at")
          .eq("status", "pending")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        if (data) localStorage.setItem(PENDING_KEY, data.created_at);
      } else {
        if (localStorage.getItem(CONFIRMED_KEY)) return;
        const { data } = await supabase
          .from("consultation_bookings")
          .select("updated_at")
          .eq("parent_id", profileId)
          .eq("status", "confirmed")
          .order("updated_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        if (data) localStorage.setItem(CONFIRMED_KEY, data.updated_at);
      }
    }

    async function pollAdmin() {
      const { data } = await supabase
        .from("consultation_bookings")
        .select("created_at")
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (cancelled || !data) return;
      const lastSeen = localStorage.getItem(PENDING_KEY);
      if (lastSeen && new Date(data.created_at).getTime() <= new Date(lastSeen).getTime()) return;
      localStorage.setItem(PENDING_KEY, data.created_at);
      if (pathnameRef.current?.includes("/consultations")) return;
      toast("Nouvelle demande de rendez-vous", {
        description: "Un parent a demandé une consultation — à approuver dans Consultations.",
      });
    }

    async function pollParent() {
      const { data } = await supabase
        .from("consultation_bookings")
        .select("updated_at")
        .eq("parent_id", profileId)
        .eq("status", "confirmed")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (cancelled || !data) return;
      const lastSeen = localStorage.getItem(CONFIRMED_KEY);
      if (lastSeen && new Date(data.updated_at).getTime() <= new Date(lastSeen).getTime()) return;
      localStorage.setItem(CONFIRMED_KEY, data.updated_at);
      if (pathnameRef.current?.includes("/consultations")) return;
      toast("Rendez-vous confirmé", {
        description: "La spécialiste a confirmé votre consultation.",
      });
    }

    seed();
    const poll = role === "admin" ? pollAdmin : pollParent;
    const id = setInterval(poll, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [profileId, role]);

  return null;
}
