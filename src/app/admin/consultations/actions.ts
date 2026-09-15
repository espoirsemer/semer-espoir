"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function createSlot(_prevState: string | null, formData: FormData) {
  await requireAdmin();

  const date = formData.get("date") as string;
  const startTime = formData.get("start_time") as string;
  const durationMinutes = Number(formData.get("duration") ?? 30);

  if (!date || !startTime) return "Date et heure sont obligatoires.";

  const startsAt = new Date(`${date}T${startTime}:00`);
  if (Number.isNaN(startsAt.getTime())) return "Date ou heure invalide.";
  const endsAt = new Date(startsAt.getTime() + durationMinutes * 60_000);

  const supabase = await createClient();
  const { error } = await supabase.from("consultation_slots").insert({
    starts_at: startsAt.toISOString(),
    ends_at: endsAt.toISOString(),
  });

  if (error) return error.message;

  revalidatePath("/admin/consultations");
  revalidatePath("/espace-parent/consultations");
  return "success";
}

export async function deleteSlot(slotId: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("consultation_slots").delete().eq("id", slotId);
  revalidatePath("/admin/consultations");
  revalidatePath("/espace-parent/consultations");
}
