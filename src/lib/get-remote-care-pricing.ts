import { createClient } from "@/lib/supabase/server";
import type { RemoteCarePricing } from "@/types/database.types";

export async function getRemoteCarePricing(): Promise<RemoteCarePricing> {
  const supabase = await createClient();
  const { data } = await supabase.from("remote_care_pricing").select("*").eq("id", true).single();

  return (
    (data as RemoteCarePricing | null) ?? {
      id: true,
      fee_autisme: 100000,
      fee_imc: 120000,
      currency: "FCFA",
      payment_link: null,
      updated_at: new Date(0).toISOString(),
    }
  );
}
