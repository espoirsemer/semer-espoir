"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { signIn } from "./actions";

// Le lien de confirmation d'inscription revient ici avec la session dans le
// fragment d'URL (#access_token=...&refresh_token=...), lisible seulement
// côté client. On l'établit dès l'arrivée pour connecter automatiquement le
// parent, sans lui faire retaper son mot de passe.
function useSessionFromEmailLink() {
  const router = useRouter();
  const [confirming, setConfirming] = useState(() =>
    typeof window !== "undefined" && window.location.hash.includes("access_token"),
  );

  useEffect(() => {
    if (!confirming) return;

    async function establishSession() {
      const params = new URLSearchParams(window.location.hash.slice(1));
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");
      window.history.replaceState(null, "", window.location.pathname + window.location.search);

      if (!access_token || !refresh_token) {
        return false;
      }

      const supabase = createClient();
      const { error } = await supabase.auth.setSession({ access_token, refresh_token });
      return !error;
    }

    establishSession().then((success) => {
      if (success) {
        router.replace("/espace-parent");
      } else {
        setConfirming(false);
      }
    });
  }, [confirming, router]);

  return confirming;
}

export default function ConnexionPage() {
  const [error, formAction, isPending] = useActionState(signIn, null);
  const confirming = useSessionFromEmailLink();

  if (confirming) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Confirmation de votre compte</CardTitle>
          <CardDescription>Un instant, nous vous connectons…</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connexion</CardTitle>
        <CardDescription>Accédez à votre espace parent.</CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" name="email" type="email" required autoComplete="email" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Connexion..." : "Se connecter"}
          </Button>
          <p className="text-sm text-muted-foreground">
            Pas encore de compte ?{" "}
            <Link href="/inscription" className="underline underline-offset-4">
              Inscrivez-vous
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
