"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function approveRemoteCareRequest(requestId: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("remote_care_requests").update({ status: "confirmed" }).eq("id", requestId);
  revalidatePath("/admin/prise-en-charge");
  revalidatePath("/espace-parent/prise-en-charge");
}

export async function deleteRemoteCareRequest(requestId: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("remote_care_requests").delete().eq("id", requestId);
  revalidatePath("/admin/prise-en-charge");
  revalidatePath("/espace-parent/prise-en-charge");
}

export async function updateRemoteCarePricing(_prevState: string | null, formData: FormData) {
  await requireAdmin();

  const feeAutismeRaw = formData.get("fee_autisme") as string;
  const feeImcRaw = formData.get("fee_imc") as string;
  const currency = (formData.get("currency") as string) || "FCFA";
  const paymentLink = (formData.get("payment_link") as string) || null;

  const feeAutisme = Number(feeAutismeRaw);
  const feeImc = Number(feeImcRaw);
  if (
    feeAutismeRaw.trim() === "" ||
    Number.isNaN(feeAutisme) ||
    feeAutisme < 0 ||
    feeImcRaw.trim() === "" ||
    Number.isNaN(feeImc) ||
    feeImc < 0
  ) {
    return "Les montants doivent être des nombres positifs.";
  }

  if (paymentLink) {
    try {
      new URL(paymentLink);
    } catch {
      return "Le lien de paiement doit être une URL valide (https://...).";
    }
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("remote_care_pricing")
    .update({
      fee_autisme: feeAutisme,
      fee_imc: feeImc,
      currency,
      payment_link: paymentLink,
      updated_at: new Date().toISOString(),
    })
    .eq("id", true);

  if (error) return error.message;

  revalidatePath("/admin/prise-en-charge");
  revalidatePath("/espace-parent/prise-en-charge");
  return "success";
}
