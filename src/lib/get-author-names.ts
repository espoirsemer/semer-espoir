import type { SupabaseClient } from "@supabase/supabase-js";

// La RLS de `profiles` limite la lecture au propre profil de l'utilisateur ;
// on passe par la fonction `get_profile_names` (security definer) pour
// afficher le nom des autres auteurs dans la communauté.
export async function getAuthorNames(
  supabase: SupabaseClient,
  authorIds: string[],
): Promise<Map<string, string>> {
  const uniqueIds = [...new Set(authorIds)];
  if (uniqueIds.length === 0) return new Map();

  const { data } = await supabase.rpc("get_profile_names", {
    profile_ids: uniqueIds,
  });

  const map = new Map<string, string>();
  for (const row of (data as { id: string; full_name: string | null }[] | null) ?? []) {
    if (row.full_name) map.set(row.id, row.full_name);
  }
  return map;
}
