"use server";

import { createClient } from "@/lib/supabase/server";

export async function requestPasswordReset(_prevState: string | null, formData: FormData) {
  const email = formData.get("email") as string;

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reinitialiser-mot-de-passe`,
  });

  if (error && (error.code === "over_email_send_rate_limit" || error.code === "over_request_rate_limit")) {
    return "rate_limited";
  }

  // Toujours "success", même si l'e-mail n'existe pas : évite de révéler
  // quelles adresses sont enregistrées (énumération de comptes).
  return "success";
}
