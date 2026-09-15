"use server";

import { revalidatePath } from "next/cache";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

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
      return "Votre formule ne permet pas encore de publier. Passez à la formule Guidance ou VIP pour participer.";
    }
    return error.message;
  }

  revalidatePath(`/espace-parent/communaute/${channelSlug}`);
  return "success";
}
