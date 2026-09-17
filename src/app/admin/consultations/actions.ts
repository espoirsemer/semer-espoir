"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

type BookingWithSlotRange = { id: string; slot: { starts_at: string; ends_at: string } | null };

export async function deleteSlot(slotId: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("consultation_slots").delete().eq("id", slotId);
  revalidatePath("/admin/consultations");
  revalidatePath("/espace-parent/consultations");
}

// Retourne un message d'erreur en cas de chevauchement avec un rendez-vous
// déjà confirmé (la spécialiste ne peut être à deux endroits à la fois),
// ou null si l'approbation a réussi.
export async function approveBooking(bookingId: string): Promise<string | null> {
  await requireAdmin();
  const supabase = await createClient();

  const { data: bookingRaw } = await supabase
    .from("consultation_bookings")
    .select("id, slot:consultation_slots(starts_at, ends_at)")
    .eq("id", bookingId)
    .single();
  const booking = bookingRaw as BookingWithSlotRange | null;

  if (!booking || !booking.slot) return "Créneau introuvable.";

  const newStart = new Date(booking.slot.starts_at).getTime();
  const newEnd = new Date(booking.slot.ends_at).getTime();

  const { data: confirmedRaw } = await supabase
    .from("consultation_bookings")
    .select("id, slot:consultation_slots(starts_at, ends_at)")
    .eq("status", "confirmed")
    .neq("id", bookingId);
  const confirmed = confirmedRaw as BookingWithSlotRange[] | null;

  const overlaps = (confirmed ?? []).some((b) => {
    if (!b.slot) return false;
    const s = new Date(b.slot.starts_at).getTime();
    const e = new Date(b.slot.ends_at).getTime();
    return newStart < e && s < newEnd;
  });

  if (overlaps) {
    return "Ce créneau chevauche un rendez-vous déjà confirmé. Déclinez l'un des deux avant d'approuver celui-ci.";
  }

  await supabase.from("consultation_bookings").update({ status: "confirmed" }).eq("id", bookingId);
  revalidatePath("/admin/consultations");
  revalidatePath("/espace-parent/consultations");
  return null;
}
