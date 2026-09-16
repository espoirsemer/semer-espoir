"use server";

import { revalidatePath } from "next/cache";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function sendMessageToSpecialist(_prevState: string | null, formData: FormData) {
  const profile = await requireProfile();
  const body = (formData.get("body") as string).trim();

  if (!body) return "Écrivez un message avant d'envoyer.";

  const supabase = await createClient();
  const { error } = await supabase.from("specialist_messages").insert({
    parent_id: profile.id,
    sender_id: profile.id,
    body,
  });

  if (error) {
    if (error.code === "42501" || error.message.includes("row-level security")) {
      return "Réservez un rendez-vous pour pouvoir échanger avec la spécialiste.";
    }
    return error.message;
  }

  revalidatePath("/espace-parent/messagerie");
  return "success";
}
