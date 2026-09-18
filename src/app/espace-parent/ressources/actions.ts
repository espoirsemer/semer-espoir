"use server";

import { revalidatePath } from "next/cache";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { ResourceFormation, ResourceFormationKey } from "@/types/database.types";

export async function purchaseFormation(_prevState: string | null, formData: FormData) {
  const profile = await requireProfile();

  const formationKey = formData.get("formation_key") as string;
  if (!["nutrition", "massage", "langage"].includes(formationKey)) {
    return "Formation invalide.";
  }
  const paymentReference = (formData.get("payment_reference") as string) || null;
  const paymentConfirmed = formData.get("payment_confirmed") === "on";

  if (!paymentConfirmed) {
    return "Merci de confirmer le paiement avant d'envoyer votre demande.";
  }

  const supabase = await createClient();

  const { data: formationRaw } = await supabase
    .from("resource_formations")
    .select("*")
    .eq("key", formationKey)
    .single();
  const formation = formationRaw as ResourceFormation | null;
  if (!formation) return "Formation introuvable.";

  const { error } = await supabase.from("resource_purchases").insert({
    parent_id: profile.id,
    formation_key: formationKey as ResourceFormationKey,
    amount: formation.price_amount,
    currency: formation.price_currency,
    payment_reference: paymentReference,
    payment_confirmed: paymentConfirmed,
  });

  if (error) {
    if (error.code === "42501" || error.message.includes("row-level security")) {
      return "Impossible d'envoyer la demande. Merci de réessayer.";
    }
    return error.message;
  }

  revalidatePath("/espace-parent/ressources");
  revalidatePath("/admin/ressources");
  return "success";
}

export async function cancelFormationPurchase(purchaseId: string) {
  await requireProfile();
  const supabase = await createClient();
  await supabase.from("resource_purchases").delete().eq("id", purchaseId);
  revalidatePath("/espace-parent/ressources");
  revalidatePath("/admin/ressources");
}
