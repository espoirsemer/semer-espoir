import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { requireProfile } from "@/lib/auth";

export default async function EspaceParentAccueil() {
  const profile = await requireProfile();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          Bonjour{profile.full_name ? `, ${profile.full_name}` : ""}
        </h1>
        <p className="text-muted-foreground">
          Formule actuelle :{" "}
          {profile.subscription_tier ?? "aucune — choisissez un abonnement"}
        </p>
      </div>

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
