"use server";

import { revalidatePath } from "next/cache";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { QUICK_EMOJIS } from "./emojis";

export async function postMessage(_prevState: string | null, formData: FormData) {
  const profile = await requireProfile();

  const channelId = formData.get("channel_id") as string;
  const channelSlug = formData.get("channel_slug") as string;
  const body = (formData.get("body") as string).trim();
  const parentMessageId = (formData.get("parent_message_id") as string) || null;

  if (!body) {
    return "Écrivez un message avant d'envoyer.";
  }

  const supabase = await createClient();
  const { error } = await supabase.from("community_messages").insert({
    channel_id: channelId,
    author_id: profile.id,
    parent_message_id: parentMessageId,
    body,
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
