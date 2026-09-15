"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function createLive(_prevState: string | null, formData: FormData) {
  await requireAdmin();

  const title = (formData.get("title") as string).trim();
  const description = (formData.get("description") as string) || null;
  const date = formData.get("date") as string;
  const time = formData.get("time") as string;
  const customLink = (formData.get("meeting_url") as string).trim();

  if (!title) return "Le titre est obligatoire.";
  if (!date || !time) return "Date et heure sont obligatoires.";

  const startsAt = new Date(`${date}T${time}:00`);
  if (Number.isNaN(startsAt.getTime())) return "Date ou heure invalide.";

  if (customLink) {
    try {
      new URL(customLink);
    } catch {
      return "Le lien de visio doit être une URL valide.";
    }
  }

  // Salle Jitsi Meet auto-générée si aucun lien n'est fourni : gratuite,
  // sans compte ni clé API, accessible instantanément via le navigateur.
  const roomSlug = `semer-espoir-${crypto.randomUUID().slice(0, 8)}`;
  const meetingUrl = customLink || `https://meet.jit.si/${roomSlug}`;

  const supabase = await createClient();
  const { error } = await supabase.from("live_sessions").insert({
    title,
    description,
    starts_at: startsAt.toISOString(),
    meeting_url: meetingUrl,
  });

  if (error) return error.message;

  revalidatePath("/admin/lives");
  revalidatePath("/espace-parent/lives");
  return "success";
}

export async function deleteLive(liveId: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("live_sessions").delete().eq("id", liveId);
  revalidatePath("/admin/lives");
  revalidatePath("/espace-parent/lives");
}
