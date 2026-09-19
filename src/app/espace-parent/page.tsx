import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

const REMINDER_DAYS_BEFORE = 5;

export default async function EspaceParentAccueil() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: plan } = await supabase
    .from("subscription_plans")
    .select("payment_link")
    .eq("key", "tier_1")
    .single();
  const paymentLink = (plan as { payment_link: string | null } | null)?.payment_link;
  const renewUrl = paymentLink || "/#tarifs";
  const renewLinkProps = paymentLink
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  const now = new Date();
  const expiresAt = profile.subscription_expires_at
    ? new Date(profile.subscription_expires_at)
    : null;
  const isExpired = expiresAt !== null && expiresAt.getTime() < now.getTime();
  const isExpiringSoon =
    expiresAt !== null &&
    !isExpired &&
    expiresAt.getTime() - now.getTime() <= REMINDER_DAYS_BEFORE * 24 * 60 * 60 * 1000;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          Bonjour{profile.full_name ? `, ${profile.full_name}` : ""}
        </h1>
        <p className="text-muted-foreground">
          Abonnement :{" "}
          {!profile.subscription_tier ? (
            <>
              aucun —{" "}
              <a href={renewUrl} {...renewLinkProps} className="underline underline-offset-4">
                abonnez-vous
              </a>
            </>
          ) : expiresAt ? (
            isExpired ? (
              "expiré"
            ) : (
              `actif jusqu'au ${expiresAt.toLocaleDateString("fr-FR")}`
            )
          ) : (
            "actif"
          )}
        </p>
      </div>

      {profile.subscription_tier && (isExpiringSoon || isExpired) && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm">
          {isExpired
            ? `Votre abonnement a expiré le ${expiresAt!.toLocaleDateString("fr-FR")}. `
            : `Votre abonnement expire le ${expiresAt!.toLocaleDateString("fr-FR")}. `}
          Renouvelez-le pour ne pas perdre l&apos;accès à la communauté.{" "}
          <a
            href={renewUrl}
            {...renewLinkProps}
            className="font-medium underline underline-offset-4"
          >
            Renouveler mon abonnement
          </a>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/espace-parent/hub">
          <Card className="h-full transition-colors hover:bg-accent">
            <CardHeader>
              <CardTitle>Hub de contenu</CardTitle>
              <CardDescription>Vidéos et ressources PDF</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/espace-parent/communaute">
          <Card className="h-full transition-colors hover:bg-accent">
            <CardHeader>
              <CardTitle>Communauté</CardTitle>
              <CardDescription>Échangez avec d&apos;autres parents</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/espace-parent/journal">
          <Card className="h-full transition-colors hover:bg-accent">
            <CardHeader>
              <CardTitle>Journal de bord</CardTitle>
              <CardDescription>Suivi quotidien de votre enfant</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
}
