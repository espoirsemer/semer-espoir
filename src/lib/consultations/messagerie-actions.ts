"use server";

import { revalidatePath } from "next/cache";
import { requireProfile, requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { uploadChatAttachment } from "@/lib/chat-attachments";
import type { CommunityAttachmentType } from "@/types/database.types";

export async function sendMessageToSpecialist(_prevState: string | null, formData: FormData) {
  const profile = await requireProfile();
  const body = (formData.get("body") as string).trim();
  const file = formData.get("attachment") as File | null;
  const hasFile = file && file.size > 0;

  if (!body && !hasFile) {
    return "Écrivez un message ou joignez un fichier avant d'envoyer.";
  }

  let attachmentPath: string | null = null;
  let attachmentType: CommunityAttachmentType | null = null;
  let attachmentName: string | null = null;

  if (hasFile) {
    const uploaded = await uploadChatAttachment(file, `dm/${profile.id}`);
    if ("error" in uploaded) return uploaded.error;
    attachmentPath = uploaded.attachmentPath;
    attachmentType = uploaded.attachmentType;
    attachmentName = uploaded.attachmentName;
  }

  const supabase = await createClient();
  const { error } = await supabase.from("specialist_messages").insert({
    parent_id: profile.id,
    sender_id: profile.id,
    body,
    attachment_path: attachmentPath,
    attachment_type: attachmentType,
    attachment_name: attachmentName,
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
  const file = formData.get("attachment") as File | null;
  const hasFile = file && file.size > 0;

  if (!body && !hasFile) {
    return "Écrivez un message ou joignez un fichier avant d'envoyer.";
  }

  let attachmentPath: string | null = null;
  let attachmentType: CommunityAttachmentType | null = null;
  let attachmentName: string | null = null;

  if (hasFile) {
    const uploaded = await uploadChatAttachment(file, `dm/${parentId}`);
    if ("error" in uploaded) return uploaded.error;
    attachmentPath = uploaded.attachmentPath;
    attachmentType = uploaded.attachmentType;
    attachmentName = uploaded.attachmentName;
  }

  const supabase = await createClient();
  const { error } = await supabase.from("specialist_messages").insert({
    parent_id: parentId,
    sender_id: admin.id,
    body,
    attachment_path: attachmentPath,
    attachment_type: attachmentType,
    attachment_name: attachmentName,
  });

  if (error) return error.message;

  revalidatePath(`/admin/consultations/messagerie/${parentId}`);
  revalidatePath("/admin/consultations");
  revalidatePath("/espace-parent/consultations");
  return "success";
}
