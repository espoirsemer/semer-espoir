"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function deleteSlot(slotId: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("consultation_slots").delete().eq("id", slotId);
  revalidatePath("/admin/consultations");
  revalidatePath("/espace-parent/consultations");
}

export async function approveBooking(bookingId: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("consultation_bookings").update({ status: "confirmed" }).eq("id", bookingId);
  revalidatePath("/admin/consultations");
  revalidatePath("/espace-parent/consultations");
}
