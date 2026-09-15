"use server";

import { revalidatePath } from "next/cache";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { TRIGGER_OPTIONS } from "./triggers";

export async function saveJournalEntry(_prevState: string | null, formData: FormData) {
  await requireProfile();

  const childId = formData.get("child_id") as string;
  const entryDate = (formData.get("entry_date") as string) || new Date().toISOString().slice(0, 10);
  const anxietyLevel = Number(formData.get("anxiety_level"));
  const notes = (formData.get("notes") as string) || null;
  const triggers = TRIGGER_OPTIONS.filter(
    (t) => formData.get(`trigger_${t.key}`) === "on",
  ).map((t) => t.key);

  if (!childId) {
    return "Sélectionnez un enfant.";
  }
  if (!anxietyLevel || anxietyLevel < 1 || anxietyLevel > 5) {
    return "Sélectionnez un niveau d'anxiété.";
  }

  const supabase = await createClient();
  const { error } = await supabase.from("journal_entries").upsert(
    {
      child_id: childId,
      entry_date: entryDate,
      anxiety_level: anxietyLevel,
      triggers,
      notes,
    },
    { onConflict: "child_id,entry_date" },
  );

  if (error) {
    return error.message;
  }

  revalidatePath("/espace-parent/journal");
  revalidatePath("/espace-parent/journal/tendances");
  return "success";
}
