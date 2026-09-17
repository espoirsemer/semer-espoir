"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function updatePlan(_prevState: string | null, formData: FormData) {
  await requireAdmin();

  const key = formData.get("key") as string;
  const priceAmountRaw = formData.get("price_amount") as string;
  const priceCurrency = (formData.get("price_currency") as string) || "FCFA";
  const paymentLink = (formData.get("payment_link") as string) || null;

  const priceAmount = priceAmountRaw.trim() === "" ? null : Number(priceAmountRaw);
  if (priceAmount != null && (Number.isNaN(priceAmount) || priceAmount < 0)) {
    return "Le prix doit être un nombre positif.";
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
    .from("subscription_plans")
    .update({
      price_amount: priceAmount,
      price_currency: priceCurrency,
      payment_link: paymentLink,
      updated_at: new Date().toISOString(),
    })
    .eq("key", key);

  if (error) {
    return error.message;
  }

  revalidatePath("/");
  revalidatePath("/admin");
  return "success";
}
