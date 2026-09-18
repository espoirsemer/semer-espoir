"use server";

import { revalidatePath } from "next/cache";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { RemoteCareCondition, RemoteCarePricing } from "@/types/database.types";

export async function requestRemoteCare(_prevState: string | null, formData: FormData) {
  const profile = await requireProfile();

  const condition = formData.get("condition") as string;
  if (condition !== "autisme" && condition !== "imc") {
    return "Choisissez la condition de l'enfant.";
  }
  const childId = (formData.get("child_id") as string) || null;
  const notes = (formData.get("notes") as string) || null;
  const paymentReference = (formData.get("payment_reference") as string) || null;
  const paymentConfirmed = formData.get("payment_confirmed") === "on";

  if (!paymentConfirmed) {
    return "Merci de confirmer le paiement avant d'envoyer votre demande.";
  }

  const supabase = await createClient();

  const { data: pricingRaw } = await supabase
    .from("remote_care_pricing")
    .select("*")
    .eq("id", true)
    .single();
  const pricing = pricingRaw as RemoteCarePricing | null;
  const amount = pricing
    ? condition === "autisme"
      ? pricing.fee_autisme
      : pricing.fee_imc
    : condition === "autisme"
      ? 100000
      : 120000;
  const currency = pricing?.currency ?? "FCFA";

  const { error } = await supabase.from("remote_care_requests").insert({
    parent_id: profile.id,
    child_id: childId,
    condition: condition as RemoteCareCondition,
    amount,
    currency,
    notes,
    payment_reference: paymentReference,
    payment_confirmed: paymentConfirmed,
  });

  if (error) {
    if (error.code === "42501" || error.message.includes("row-level security")) {
      return "Impossible d'envoyer la demande. Merci de réessayer.";
    }
    return error.message;
  }

  revalidatePath("/espace-parent/prise-en-charge");
  revalidatePath("/admin/prise-en-charge");
  return "success";
}

export async function cancelRemoteCareRequest(requestId: string) {
  await requireProfile();
  const supabase = await createClient();
  await supabase.from("remote_care_requests").delete().eq("id", requestId);
  revalidatePath("/espace-parent/prise-en-charge");
  revalidatePath("/admin/prise-en-charge");
}
