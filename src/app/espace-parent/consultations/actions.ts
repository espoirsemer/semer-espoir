"use server";

import { revalidatePath } from "next/cache";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function requestConsultation(_prevState: string | null, formData: FormData) {
  const profile = await requireProfile();

  const date = formData.get("date") as string;
  const startTime = formData.get("start_time") as string;
  const durationMinutes = Number(formData.get("duration") ?? 30);
  const childId = (formData.get("child_id") as string) || null;
  const notes = (formData.get("notes") as string) || null;

  if (!date || !startTime) return "Date et heure sont obligatoires.";

  const startsAt = new Date(`${date}T${startTime}:00`);
  if (Number.isNaN(startsAt.getTime())) return "Date ou heure invalide.";
  if (startsAt.getTime() <= Date.now()) return "Choisissez une date future.";
  const endsAt = new Date(startsAt.getTime() + durationMinutes * 60_000);

  const supabase = await createClient();

  const { data: slot, error: slotError } = await supabase
    .from("consultation_slots")
    .insert({ starts_at: startsAt.toISOString(), ends_at: endsAt.toISOString() })
    .select()
    .single();

  if (slotError) {
    if (slotError.code === "42501" || slotError.message.includes("row-level security")) {
      return "Votre abonnement ne permet pas encore de demander une consultation.";
    }
    return slotError.message;
  }

  const { error: bookingError } = await supabase.from("consultation_bookings").insert({
    slot_id: slot.id,
    parent_id: profile.id,
    child_id: childId,
    notes,
  });

  if (bookingError) {
    // Le créneau a été créé mais la réservation a échoué : on nettoie pour éviter un créneau orphelin.
    await supabase.from("consultation_slots").delete().eq("id", slot.id);
    return bookingError.message;
  }

  revalidatePath("/espace-parent/consultations");
  revalidatePath("/admin/consultations");
  return "success";
}

export async function cancelBooking(bookingId: string) {
  await requireProfile();
  const supabase = await createClient();

  const { data: booking } = await supabase
    .from("consultation_bookings")
    .select("slot_id")
    .eq("id", bookingId)
    .single();

  if (booking) {
    // Supprimer le créneau entraîne la suppression de la réservation par cascade.
    await supabase.from("consultation_slots").delete().eq("id", booking.slot_id);
  }

  revalidatePath("/espace-parent/consultations");
  revalidatePath("/admin/consultations");
}
