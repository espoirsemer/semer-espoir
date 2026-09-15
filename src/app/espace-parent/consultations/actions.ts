"use server";

import { revalidatePath } from "next/cache";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function bookSlot(_prevState: string | null, formData: FormData) {
  const profile = await requireProfile();

  const slotId = formData.get("slot_id") as string;
  const childId = (formData.get("child_id") as string) || null;
  const notes = (formData.get("notes") as string) || null;

  const supabase = await createClient();
  const { error } = await supabase.from("consultation_bookings").insert({
    slot_id: slotId,
    parent_id: profile.id,
    child_id: childId,
    notes,
  });

  if (error) {
    if (error.code === "23505") {
      return "Ce créneau vient d'être réservé par quelqu'un d'autre.";
    }
    if (error.code === "42501" || error.message.includes("row-level security")) {
      return "Votre formule ne permet pas encore de réserver une consultation. Passez à Guidance ou VIP.";
    }
    return error.message;
  }

  revalidatePath("/espace-parent/consultations");
  revalidatePath("/admin/consultations");
  return "success";
}

export async function cancelBooking(bookingId: string) {
  await requireProfile();
  const supabase = await createClient();
  await supabase.from("consultation_bookings").delete().eq("id", bookingId);
  revalidatePath("/espace-parent/consultations");
  revalidatePath("/admin/consultations");
}
