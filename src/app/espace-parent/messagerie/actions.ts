"use server";

import { revalidatePath } from "next/cache";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function startConversation(otherParentId: string): Promise<string> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const [parentA, parentB] =
    profile.id < otherParentId
      ? [profile.id, otherParentId]
      : [otherParentId, profile.id];

  const { data: existing } = await supabase
    .from("direct_conversations")
    .select("id")
    .eq("parent_a_id", parentA)
    .eq("parent_b_id", parentB)
    .maybeSingle();

  let conversationId = existing?.id;

  if (!conversationId) {
    const { data: created, error } = await supabase
      .from("direct_conversations")
      .insert({ parent_a_id: parentA, parent_b_id: parentB })
      .select("id")
      .single();

    if (error || !created) {
      throw new Error(error?.message ?? "Impossible de démarrer la conversation.");
    }
    conversationId = created.id;
  }

  revalidatePath("/espace-parent/messagerie");
  return conversationId;
}

export type SearchState = {
  results: { id: string; full_name: string | null }[];
};

export async function searchParents(_prevState: SearchState | null, formData: FormData) {
  await requireProfile();
  const query = (formData.get("q") as string) ?? "";

  const supabase = await createClient();
  const { data } = await supabase.rpc("search_parents", { search_query: query });

  return { results: (data as { id: string; full_name: string | null }[] | null) ?? [] };
}

export async function sendDirectMessage(_prevState: string | null, formData: FormData) {
  const profile = await requireProfile();
  const conversationId = formData.get("conversation_id") as string;
  const body = (formData.get("body") as string).trim();

  if (!body) return "Écrivez un message avant d'envoyer.";

  const supabase = await createClient();
  const { error } = await supabase.from("direct_messages").insert({
    conversation_id: conversationId,
    sender_id: profile.id,
    body,
  });

  if (error) return error.message;

  revalidatePath(`/espace-parent/messagerie/${conversationId}`);
  revalidatePath("/espace-parent/messagerie");
  return "success";
}
