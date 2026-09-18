import { createClient } from "@/lib/supabase/server";
import type { ResourceFormation, ResourceFormationKey } from "@/types/database.types";

export const RESOURCE_FORMATION_ORDER: ResourceFormationKey[] = ["nutrition", "massage", "langage"];

const FALLBACK_NAMES: Record<ResourceFormationKey, string> = {
  nutrition: "Livres pour nutrition",
  massage: "Massage",
  langage: "Langage (apprendre à parler)",
};

export async function getResourceFormations(): Promise<ResourceFormation[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("resource_formations").select("*").order("key");

  const formations = (data as ResourceFormation[] | null) ?? [];

  return RESOURCE_FORMATION_ORDER.map(
    (key) =>
      formations.find((f) => f.key === key) ?? {
        key,
        name: FALLBACK_NAMES[key],
        price_amount: 0,
        price_currency: "FCFA",
        payment_link: null,
        updated_at: new Date(0).toISOString(),
      },
  );
}
