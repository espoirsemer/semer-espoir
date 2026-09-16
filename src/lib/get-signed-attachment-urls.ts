import { createAdminClient } from "@/lib/supabase/server";

const SIGNED_URL_TTL_SECONDS = 60 * 60; // 1h : largement suffisant pour l'affichage d'une page.

// Le bucket "communaute" est privé : on génère une URL signée à la demande
// plutôt que de stocker une URL qui expirerait en base.
export async function getSignedAttachmentUrls(paths: string[]): Promise<Map<string, string>> {
  const uniquePaths = [...new Set(paths)];
  if (uniquePaths.length === 0) return new Map();

  const admin = createAdminClient();
  const { data } = await admin.storage
    .from("communaute")
    .createSignedUrls(uniquePaths, SIGNED_URL_TTL_SECONDS);

  const map = new Map<string, string>();
  for (const row of data ?? []) {
    if (row.signedUrl && row.path) map.set(row.path, row.signedUrl);
  }
  return map;
}
