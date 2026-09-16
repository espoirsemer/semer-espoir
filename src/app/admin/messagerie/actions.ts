"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

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

  revalidatePath(`/admin/messagerie/${parentId}`);
  revalidatePath("/admin/messagerie");
  revalidatePath("/espace-parent/messagerie");
  return "success";
}
