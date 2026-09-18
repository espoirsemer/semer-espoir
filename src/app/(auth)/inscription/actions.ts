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
    const loginUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/connexion`;
    await sendTransactionalEmail({
      to: [{ email, name: fullName }],
      subject: "Bienvenue sur Semer Espoir",
      htmlContent: `
        <div style="background-color: #0f172a; padding: 32px 16px; font-family: 'Segoe UI', Arial, sans-serif;">
          <div style="max-width: 480px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden;">
            <div style="background-color: #0f172a; padding: 24px 32px;">
              <p style="margin: 0; font-size: 18px; font-weight: 700; color: #ffffff; letter-spacing: 0.02em;">Semer Espoir</p>
            </div>
            <div style="padding: 32px; color: #1c1917;">
              <h1 style="font-size: 20px; margin: 0 0 16px;">Bienvenue, ${fullName} !</h1>
              <p style="font-size: 15px; line-height: 1.6; margin: 0 0 16px;">
                Merci de rejoindre Semer Espoir. Un e-mail de confirmation distinct vous a aussi été envoyé — cliquez sur son lien pour activer votre compte, puis accédez à votre espace parent :
              </p>
              <div style="text-align: center; margin: 28px 0;">
                <a href="${loginUrl}" style="display: inline-block; background-color: #84cc16; color: #0f172a; font-weight: 700; font-size: 15px; padding: 12px 28px; border-radius: 8px; text-decoration: none;">
                  Accéder à mon espace parent
                </a>
              </div>
              <p style="font-size: 15px; line-height: 1.6; margin: 0 0 8px;">
                Vous y retrouverez : le hub de contenu, la communauté, le journal de bord, et bien plus.
              </p>
              <p style="font-size: 13px; color: #78716c; margin: 24px 0 0;">
                Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br />
                <a href="${loginUrl}" style="color: #65a30d;">${loginUrl}</a>
              </p>
            </div>
            <div style="padding: 16px 32px; background-color: #f5f5f4; text-align: center;">
              <p style="font-size: 12px; color: #a8a29e; margin: 0;">À très vite,<br />L'équipe Semer Espoir</p>
            </div>
          </div>
        </div>
      `,
    });
  } catch (emailError) {
    console.error("Échec de l'envoi de l'e-mail de bienvenue Brevo :", emailError);
  }

  return "success";
}
