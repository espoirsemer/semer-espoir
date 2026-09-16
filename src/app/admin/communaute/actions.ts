"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function createChannel(_prevState: string | null, formData: FormData) {
  await requireAdmin();
  const name = (formData.get("name") as string).trim();
  const description = (formData.get("description") as string) || null;
  if (!name) return "Le nom est obligatoire.";

  const slug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const supabase = await createClient();
  const { error } = await supabase
    .from("community_channels")
    .insert({ name, slug, description });

  if (error) return error.message;

  revalidatePath("/admin/communaute");
  revalidatePath("/espace-parent/communaute");
  return "success";
}

export async function deleteChannel(channelId: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("community_channels").delete().eq("id", channelId);
  revalidatePath("/admin/communaute");
  revalidatePath("/espace-parent/communaute");
}

export async function togglePin(messageId: string, pinned: boolean, slug: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("community_messages").update({ pinned: !pinned }).eq("id", messageId);
  revalidatePath(`/admin/communaute/${slug}`);
  revalidatePath(`/espace-parent/communaute/${slug}`);
}

export async function deleteMessage(messageId: string, slug: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("community_messages").delete().eq("id", messageId);
  revalidatePath(`/admin/communaute/${slug}`);
  revalidatePath(`/espace-parent/communaute/${slug}`);
}

export async function toggleChannelLock(channelId: string, slug: string) {
  await requireAdmin();
  const supabase = await createClient();
  // On relit l'état actuel depuis la base plutôt que de faire confiance à la
  // valeur passée par le client, pour éviter d'inverser le verrouillage sur
  // une valeur obsolète (onglet resté ouvert, double clic, etc.).
  const { data: current } = await supabase
    .from("community_channels")
    .select("locked")
    .eq("id", channelId)
    .single();
  await supabase
    .from("community_channels")
    .update({ locked: !current?.locked })
    .eq("id", channelId);
  revalidatePath(`/admin/communaute/${slug}`);
  revalidatePath("/admin/communaute");
  revalidatePath(`/espace-parent/communaute/${slug}`);
  revalidatePath("/espace-parent/communaute");
}
