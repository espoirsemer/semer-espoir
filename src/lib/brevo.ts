// Envoi d'e-mails transactionnels via l'API Brevo (confirmation d'inscription,
// notifications de réponse en communauté, annonces admin — module 1 et 3).
const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

type SendTransactionalEmailParams = {
  to: { email: string; name?: string }[];
  subject: string;
  htmlContent: string;
};

export async function sendTransactionalEmail({
  to,
  subject,
  htmlContent,
}: SendTransactionalEmailParams) {
  const response = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": process.env.BREVO_API_KEY!,
    },
    body: JSON.stringify({
      sender: {
        email: process.env.BREVO_SENDER_EMAIL,
        name: process.env.BREVO_SENDER_NAME,
      },
      to,
      subject,
      htmlContent,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Brevo: échec de l'envoi (${response.status}) ${errorBody}`);
  }

  return response.json();
}
