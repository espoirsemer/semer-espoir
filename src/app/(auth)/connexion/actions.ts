"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type SignInState = {
  message: string;
  needsConfirmation?: boolean;
  email?: string;
} | null;

export async function signIn(_prevState: SignInState, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.code === "email_not_confirmed") {
      return {
        message: "Votre adresse e-mail n'a pas encore été confirmée. Vérifiez votre boîte mail, ou renvoyez le lien ci-dessous.",
        needsConfirmation: true,
        email,
      };
    }
    if (error.code === "over_request_rate_limit" || error.code === "over_email_send_rate_limit") {
      return { message: "Trop de tentatives. Veuillez réessayer dans quelques minutes." };
    }
    return { message: "E-mail ou mot de passe incorrect." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  redirect(profile?.role === "admin" ? "/admin" : "/espace-parent");
}

export type ResendState = { success: boolean; message: string } | null;

export async function resendConfirmation(_prevState: ResendState, formData: FormData) {
  const email = formData.get("email") as string;

  const supabase = await createClient();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/connexion` },
  });

  if (error) {
    return { success: false, message: "Impossible de renvoyer l'e-mail pour le moment. Réessayez plus tard." };
  }

  return { success: true, message: "E-mail de confirmation renvoyé. Vérifiez votre boîte mail." };
}
