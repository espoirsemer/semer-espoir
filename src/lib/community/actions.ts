"use server";

import { revalidatePath } from "next/cache";
import { requireProfile } from "@/lib/auth";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { QUICK_EMOJIS } from "./emojis";
import type { CommunityAttachmentType } from "@/types/database.types";

const MAX_ATTACHMENT_BYTES = 25 * 1024 * 1024;

function attachmentTypeFor(mimeType: string): CommunityAttachmentType | null {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("audio/")) return "audio";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType === "application/pdf") return "pdf";
  return null;
}

export async function postMessage(_prevState: string | null, formData: FormData) {
  const profile = await requireProfile();

  const channelId = formData.get("channel_id") as string;
  const channelSlug = formData.get("channel_slug") as string;
  const body = (formData.get("body") as string).trim();
  const parentMessageId = (formData.get("parent_message_id") as string) || null;
  const file = formData.get("attachment") as File | null;
  const hasFile = file && file.size > 0;

  if (!body && !hasFile) {
    return "Écrivez un message ou joignez un fichier avant d'envoyer.";
  }

  let attachmentPath: string | null = null;
  let attachmentType: CommunityAttachmentType | null = null;
  let attachmentName: string | null = null;

  if (hasFile) {
    if (file.size > MAX_ATTACHMENT_BYTES) {
      return "Le fichier dépasse la taille maximale (25 Mo).";
    }
    const type = attachmentTypeFor(file.type);
    if (!type) {
      return "Format de fichier non pris en charge (photo, PDF, audio ou vidéo uniquement).";
    }

    // Le bucket "communaute" est privé et n'a pas de politique RLS dédiée :
    // on passe par le client service role pour l'upload, jamais exposé au client.
    const admin = createAdminClient();
    const ext = file.name.includes(".") ? file.name.split(".").pop() : null;
    const path = `${channelId}/${crypto.randomUUID()}${ext ? `.${ext}` : ""}`;
    const { error: uploadError } = await admin.storage
      .from("communaute")
      .upload(path, file, { contentType: file.type });

    if (uploadError) {
      return `Échec de l'envoi du fichier : ${uploadError.message}`;
    }

    attachmentPath = path;
    attachmentType = type;
    attachmentName = file.name;
  }

  const supabase = await createClient();
  const { error } = await supabase.from("community_messages").insert({
    channel_id: channelId,
    author_id: profile.id,
    parent_message_id: parentMessageId,
    body,
    attachment_path: attachmentPath,
    attachment_type: attachmentType,
    attachment_name: attachmentName,
  });

  if (error) {
    if (error.code === "42501" || error.message.includes("row-level security")) {
      return "La spécialiste a verrouillé ce canal : seuls les administrateurs peuvent écrire pour l'instant.";
    }
    return error.message;
  }

  revalidatePath(`/espace-parent/communaute/${channelSlug}`);
  revalidatePath(`/admin/communaute/${channelSlug}`);
  return "success";
}

export async function toggleReaction(messageId: string, emoji: string, channelSlug: string) {
  if (!QUICK_EMOJIS.includes(emoji)) return;
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("community_reactions")
    .select("emoji")
    .eq("message_id", messageId)
    .eq("profile_id", profile.id)
    .maybeSingle();

  if (existing?.emoji === emoji) {
    await supabase
      .from("community_reactions")
      .delete()
      .eq("message_id", messageId)
      .eq("profile_id", profile.id);
  } else {
    // Une seule réaction par personne et par message, comme sur WhatsApp :
    // on retire l'éventuelle réaction précédente avant d'ajouter la nouvelle.
    await supabase
      .from("community_reactions")
      .delete()
      .eq("message_id", messageId)
      .eq("profile_id", profile.id);
    await supabase
      .from("community_reactions")
      .insert({ message_id: messageId, profile_id: profile.id, emoji });
  }

  revalidatePath(`/espace-parent/communaute/${channelSlug}`);
  revalidatePath(`/admin/communaute/${channelSlug}`);
}
