"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function approveFormationPurchase(purchaseId: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("resource_purchases").update({ status: "confirmed" }).eq("id", purchaseId);
  revalidatePath("/admin/ressources");
  revalidatePath("/espace-parent/ressources");
}

export async function deleteFormationPurchase(purchaseId: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("resource_purchases").delete().eq("id", purchaseId);
  revalidatePath("/admin/ressources");
  revalidatePath("/espace-parent/ressources");
}

export async function updateResourceFormation(_prevState: string | null, formData: FormData) {
  await requireAdmin();

  const key = formData.get("key") as string;
  const name = (formData.get("name") as string)?.trim();
  const priceAmountRaw = formData.get("price_amount") as string;
  const priceCurrency = (formData.get("price_currency") as string) || "FCFA";
  const paymentLink = (formData.get("payment_link") as string) || null;

  if (!name) return "Le nom est obligatoire.";

  const priceAmount = Number(priceAmountRaw);
  if (priceAmountRaw.trim() === "" || Number.isNaN(priceAmount) || priceAmount < 0) {
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
    .from("resource_formations")
    .update({
      name,
      price_amount: priceAmount,
      price_currency: priceCurrency,
      payment_link: paymentLink,
      updated_at: new Date().toISOString(),
    })
    .eq("key", key);

  if (error) return error.message;

  revalidatePath("/admin/ressources");
  revalidatePath("/espace-parent/ressources");
  return "success";
}

export async function addFormationContent(_prevState: string | null, formData: FormData) {
  await requireAdmin();

  const formationKey = formData.get("formation_key") as string;
  const title = (formData.get("title") as string).trim();
  const type = formData.get("type") as "video" | "pdf";
  const file = formData.get("file") as File;

  if (!title) return "Le titre est obligatoire.";
  if (!file || file.size === 0) return "Sélectionnez un fichier.";

  const supabase = await createClient();

  const ext = file.name.split(".").pop();
  const storagePath = `resources/${formationKey}/${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("contenu")
    .upload(storagePath, file, { contentType: file.type });

  if (uploadError) return uploadError.message;

  const { error } = await supabase.from("resource_formation_content").insert({
    formation_key: formationKey,
    title,
    type,
    storage_path: storagePath,
  });

  if (error) return error.message;

  revalidatePath("/admin/ressources");
  revalidatePath("/espace-parent/ressources");
  return "success";
}

export async function deleteFormationContent(contentId: string, storagePath: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.storage.from("contenu").remove([storagePath]);
  await supabase.from("resource_formation_content").delete().eq("id", contentId);
  revalidatePath("/admin/ressources");
  revalidatePath("/espace-parent/ressources");
}
