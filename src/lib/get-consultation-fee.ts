import { createClient } from "@/lib/supabase/server";
import type { ConsultationFee } from "@/types/database.types";

export async function getConsultationFee(): Promise<ConsultationFee> {
  const supabase = await createClient();
  const { data } = await supabase.from("consultation_fee").select("*").eq("id", true).single();

  return (
    (data as ConsultationFee | null) ?? {
      id: true,
      amount: 15000,
      currency: "FCFA",
      payment_link: null,
      updated_at: new Date(0).toISOString(),
    }
  );
}
