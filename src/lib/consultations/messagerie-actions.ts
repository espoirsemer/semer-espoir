"use server";

import { revalidatePath } from "next/cache";
import { requireProfile, requireAdmin } from "@/lib/auth";
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
      return "Votre rendez-vous doit d'abord être confirmé par la spécialiste pour pouvoir échanger ici.";
    }
    return error.message;
  }

  revalidatePath("/espace-parent/consultations");
  return "success";
}

export async function replyToParent(_prevState: string | null, formData: FormData) {
  const admin = await requireAdmin();
  const parentId = formData.get("parent_id") as string;
  const body = (formData.get("body") as string).trim();

  if (!body) return "Écrivez un message avant d'envoyer.";

  const supabase = await createClient();
  const { error } = await supabase.from("specialist_messages").insert({
    parent_id: parentId,
    sender_id: admin.id,
    body,
  });

  if (error) return error.message;

  revalidatePath(`/admin/consultations/messagerie/${parentId}`);
  revalidatePath("/admin/consultations");
  revalidatePath("/espace-parent/consultations");
  return "success";
}
