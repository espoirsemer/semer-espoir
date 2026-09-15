"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function createCategory(_prevState: string | null, formData: FormData) {
  await requireAdmin();
  const name = (formData.get("name") as string).trim();
  if (!name) return "Le nom est obligatoire.";

  const slug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const supabase = await createClient();
  const { error } = await supabase.from("content_categories").insert({ name, slug });
  if (error) return error.message;

  revalidatePath("/admin/contenus");
  return "success";
}

export async function deleteCategory(categoryId: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("content_categories").delete().eq("id", categoryId);
  revalidatePath("/admin/contenus");
}

export async function createContentItem(_prevState: string | null, formData: FormData) {
  await requireAdmin();

  const title = (formData.get("title") as string).trim();
  const description = (formData.get("description") as string) || null;
  const type = formData.get("type") as "video" | "pdf";
  const categoryId = (formData.get("category_id") as string) || null;
  const file = formData.get("file") as File;

  if (!title) return "Le titre est obligatoire.";
  if (!file || file.size === 0) return "Sélectionnez un fichier.";

  const supabase = await createClient();

  const ext = file.name.split(".").pop();
  const storagePath = `${type}s/${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("contenu")
    .upload(storagePath, file, { contentType: file.type });

  if (uploadError) return uploadError.message;

  const { error } = await supabase.from("content_items").insert({
    title,
    description,
    type,
    category_id: categoryId,
    storage_path: storagePath,
  });

  if (error) return error.message;

  revalidatePath("/admin/contenus");
  revalidatePath("/espace-parent/hub");
  return "success";
}

export async function deleteContentItem(itemId: string, storagePath: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.storage.from("contenu").remove([storagePath]);
  await supabase.from("content_items").delete().eq("id", itemId);
  revalidatePath("/admin/contenus");
  revalidatePath("/espace-parent/hub");
}
