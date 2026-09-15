"use server";

import { revalidatePath } from "next/cache";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

function parseSensitivities(raw: string): string[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function saveChild(_prevState: string | null, formData: FormData) {
  const profile = await requireProfile();

  const id = formData.get("id") as string;
  const firstName = (formData.get("first_name") as string).trim();
  const birthDate = (formData.get("birth_date") as string) || null;
  const languageLevel = (formData.get("language_level") as string) || null;
  const sensitivities = parseSensitivities(
    (formData.get("sensory_sensitivities") as string) || "",
  );

  if (!firstName) {
    return "Le prénom est obligatoire.";
  }

  const supabase = await createClient();

  const payload = {
    parent_id: profile.id,
    first_name: firstName,
    birth_date: birthDate,
    language_level: languageLevel,
    sensory_sensitivities: sensitivities,
  };

  const { error } = id
    ? await supabase.from("children").update(payload).eq("id", id)
    : await supabase.from("children").insert(payload);

  if (error) {
    return error.message;
  }

  revalidatePath("/espace-parent/profil");
  return "success";
}

export async function deleteChild(childId: string) {
  await requireProfile();
  const supabase = await createClient();
  await supabase.from("children").delete().eq("id", childId);
  revalidatePath("/espace-parent/profil");
}
