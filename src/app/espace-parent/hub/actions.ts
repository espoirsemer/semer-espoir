"use server";

import { revalidatePath } from "next/cache";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function toggleProgress(contentItemId: string, completed: boolean) {
  const profile = await requireProfile();
  const supabase = await createClient();

  if (completed) {
    await supabase
      .from("content_progress")
      .delete()
      .eq("profile_id", profile.id)
      .eq("content_item_id", contentItemId);
  } else {
    await supabase
      .from("content_progress")
      .upsert(
        { profile_id: profile.id, content_item_id: contentItemId },
        { onConflict: "profile_id,content_item_id" },
      );
  }

  revalidatePath("/espace-parent/hub");
}
