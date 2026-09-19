import { sendTransactionalEmail } from "@/lib/brevo";

function emailShell({
  title,
  bodyHtml,
  ctaLabel,
  ctaUrl,
}: {
  title: string;
  bodyHtml: string;
  ctaLabel: string;
  ctaUrl: string;
}) {
  return `
    <div style="background-color: #0f172a; padding: 32px 16px; font-family: 'Segoe UI', Arial, sans-serif;">
      <div style="max-width: 480px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden;">
        <div style="background-color: #0f172a; padding: 24px 32px;">
          <p style="margin: 0; font-size: 18px; font-weight: 700; color: #ffffff; letter-spacing: 0.02em;">Semer Espoir</p>
        </div>
        <div style="padding: 32px; color: #1c1917;">
          <h1 style="font-size: 20px; margin: 0 0 16px;">${title}</h1>
          ${bodyHtml}
          <div style="text-align: center; margin: 28px 0;">
            <a href="${ctaUrl}" style="display: inline-block; background-color: #84cc16; color: #0f172a; font-weight: 700; font-size: 15px; padding: 12px 28px; border-radius: 8px; text-decoration: none;">
              ${ctaLabel}
            </a>
          </div>
          <p style="font-size: 13px; color: #78716c; margin: 24px 0 0;">
            Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br />
            <a href="${ctaUrl}" style="color: #65a30d;">${ctaUrl}</a>
          </p>
        </div>
        <div style="padding: 16px 32px; background-color: #f5f5f4; text-align: center;">
          <p style="font-size: 12px; color: #a8a29e; margin: 0;">À très vite,<br />L'équipe Semer Espoir</p>
        </div>
      </div>
    </div>
  `;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export async function sendSubscriptionReminderEmail({
  email,
  fullName,
  expiresAt,
  renewUrl,
}: {
  email: string;
  fullName: string | null;
  expiresAt: string;
  renewUrl: string;
}) {
  await sendTransactionalEmail({
    to: [{ email, name: fullName ?? undefined }],
    subject: "Votre abonnement Semer Espoir expire bientôt",
    htmlContent: emailShell({
      title: `Bonjour${fullName ? ` ${fullName}` : ""},`,
      bodyHtml: `
        <p style="font-size: 15px; line-height: 1.6; margin: 0 0 16px;">
          Votre abonnement Semer Espoir expire le <strong>${formatDate(expiresAt)}</strong>, dans 5 jours.
        </p>
        <p style="font-size: 15px; line-height: 1.6; margin: 0 0 16px;">
          Renouvelez dès maintenant pour continuer à profiter de la communauté et de tous les avantages de votre abonnement sans interruption.
        </p>
      `,
      ctaLabel: "Renouveler mon abonnement",
      ctaUrl: renewUrl,
    }),
  });
}

export async function sendSubscriptionExpiredEmail({
  email,
  fullName,
  expiresAt,
  graceDays,
  renewUrl,
}: {
  email: string;
  fullName: string | null;
  expiresAt: string;
  graceDays: number;
  renewUrl: string;
}) {
  await sendTransactionalEmail({
    to: [{ email, name: fullName ?? undefined }],
    subject: "Votre abonnement Semer Espoir a expiré",
    htmlContent: emailShell({
      title: `Bonjour${fullName ? ` ${fullName}` : ""},`,
      bodyHtml: `
        <p style="font-size: 15px; line-height: 1.6; margin: 0 0 16px;">
          Votre abonnement Semer Espoir a expiré le <strong>${formatDate(expiresAt)}</strong>.
        </p>
        <p style="font-size: 15px; line-height: 1.6; margin: 0 0 16px;">
          Vous avez encore <strong>${graceDays} jours</strong> pour le renouveler avant de perdre l'accès à la communauté et aux autres avantages réservés aux abonnés.
        </p>
      `,
      ctaLabel: "Renouveler mon abonnement",
      ctaUrl: renewUrl,
    }),
  });
}

export async function sendSubscriptionSuspendedEmail({
  email,
  fullName,
  renewUrl,
}: {
  email: string;
  fullName: string | null;
  renewUrl: string;
}) {
  await sendTransactionalEmail({
    to: [{ email, name: fullName ?? undefined }],
    subject: "Votre accès Semer Espoir a été suspendu",
    htmlContent: emailShell({
      title: `Bonjour${fullName ? ` ${fullName}` : ""},`,
      bodyHtml: `
        <p style="font-size: 15px; line-height: 1.6; margin: 0 0 16px;">
          Votre abonnement n'ayant pas été renouvelé, votre accès à la communauté et aux avantages réservés aux abonnés a été suspendu.
        </p>
        <p style="font-size: 15px; line-height: 1.6; margin: 0 0 16px;">
          Vous pouvez à tout moment reprendre un abonnement pour retrouver votre accès complet.
        </p>
      `,
      ctaLabel: "Reprendre un abonnement",
      ctaUrl: renewUrl,
    }),
  });
}
