"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function addChildNote(_prevState: string | null, formData: FormData) {
  const admin = await requireAdmin();

  const childId = formData.get("child_id") as string;
  const parentId = formData.get("parent_id") as string;
  const bookingId = (formData.get("booking_id") as string) || null;
  const body = (formData.get("body") as string).trim();

  if (!body) return "Écrivez une note avant d'enregistrer.";

  const supabase = await createClient();
  const { error } = await supabase.from("child_notes").insert({
    child_id: childId,
    booking_id: bookingId,
    author_id: admin.id,
    body,
  });

  if (error) return error.message;

  revalidatePath(`/admin/abonnes/${parentId}`);
  return "success";
}

export async function deleteChildNote(noteId: string, parentId: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("child_notes").delete().eq("id", noteId);
  revalidatePath(`/admin/abonnes/${parentId}`);
}

export async function setProfileRole(profileId: string, role: "admin" | "parent") {
  const admin = await requireAdmin();

  if (profileId === admin.id && role === "parent") {
    return { error: "Vous ne pouvez pas retirer votre propre statut administrateur." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update({ role }).eq("id", profileId);

  if (error) return { error: error.message };

  revalidatePath("/admin/abonnes");
  revalidatePath(`/admin/abonnes/${profileId}`);
  return { error: null };
}

export async function activateSubscription(profileId: string) {
  await requireAdmin();

  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + 1);

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      subscription_tier: "tier_1",
      subscription_expires_at: expiresAt.toISOString(),
      subscription_reminder_sent_at: null,
      subscription_expired_sent_at: null,
    })
    .eq("id", profileId);

  if (error) return { error: error.message };

  revalidatePath("/admin/abonnes");
  revalidatePath(`/admin/abonnes/${profileId}`);
  return { error: null };
}

export async function suspendSubscription(profileId: string) {
  await requireAdmin();

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      subscription_tier: null,
      subscription_expires_at: null,
      subscription_reminder_sent_at: null,
      subscription_expired_sent_at: null,
    })
    .eq("id", profileId);

  if (error) return { error: error.message };

  revalidatePath("/admin/abonnes");
  revalidatePath(`/admin/abonnes/${profileId}`);
  return { error: null };
}
