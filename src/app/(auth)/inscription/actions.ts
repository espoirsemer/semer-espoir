"use server";

import { createClient } from "@/lib/supabase/server";
import { sendTransactionalEmail } from "@/lib/brevo";

export async function signUp(_prevState: string | null, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      // Redirige vers /connexion (page publique) et non /espace-parent
      // directement : le lien de confirmation revient avec la session dans
      // le fragment d'URL (#access_token=...), invisible du serveur. Si la
      // cible était une route protégée, le middleware redirigerait vers la
      // connexion AVANT même que le JS client n'ait pu lire ce fragment.
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/connexion`,
    },
  });

  if (error) {
    return error.message;
  }

  // Message de bienvenue distinct de l'e-mail de confirmation Supabase : si
  // Brevo n'est pas encore configuré ou échoue, l'inscription elle-même ne
  // doit surtout pas être bloquée.
  try {
    await sendTransactionalEmail({
      to: [{ email, name: fullName }],
      subject: "Bienvenue sur Semer Espoir",
      htmlContent: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #292524;">
          <h1 style="font-size: 20px;">Bienvenue, ${fullName} !</h1>
          <p>Merci de rejoindre Semer Espoir. Un e-mail de confirmation vous a été envoyé séparément — cliquez sur son lien pour activer votre compte.</p>
          <p>Une fois votre compte activé, vous retrouverez dans votre espace parent : le hub de contenu, la communauté, le journal de bord, et bien plus.</p>
          <p>À très vite,<br />L'équipe Semer Espoir</p>
        </div>
      `,
    });
  } catch (emailError) {
    console.error("Échec de l'envoi de l'e-mail de bienvenue Brevo :", emailError);
  }

  return "success";
}
