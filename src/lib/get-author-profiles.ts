import { createAdminClient } from "@/lib/supabase/server";

export type AuthorProfile = { fullName: string | null; role: "admin" | "parent" };

// Utilise le client service role (jamais exposé au client) pour lire le rôle
// des auteurs de messages, sans dépendre d'une nouvelle fonction SQL : la RLS
// de `profiles` ne laisse un parent voir que sa propre ligne.
export async function getAuthorProfiles(
  authorIds: string[],
): Promise<Map<string, AuthorProfile>> {
  const uniqueIds = [...new Set(authorIds)];
  if (uniqueIds.length === 0) return new Map();

  const admin = createAdminClient();
  const { data } = await admin
    .from("profiles")
    .select("id, full_name, role")
    .in("id", uniqueIds);

  const map = new Map<string, AuthorProfile>();
  for (const row of (data as { id: string; full_name: string | null; role: "admin" | "parent" }[] | null) ?? []) {
    map.set(row.id, { fullName: row.full_name, role: row.role });
  }
  return map;
}
