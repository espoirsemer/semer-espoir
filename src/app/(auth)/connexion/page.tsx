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
import { signIn, resendConfirmation } from "./actions";

function ResendConfirmation({ email }: { email: string }) {
  const [state, formAction, isPending] = useActionState(resendConfirmation, null);

  return (
    <form action={formAction} className="flex flex-col items-start gap-2">
      <input type="hidden" name="email" value={email} />
      <Button type="submit" variant="outline" size="sm" disabled={isPending}>
        {isPending ? "Envoi..." : "Renvoyer l'e-mail de confirmation"}
      </Button>
      {state && (
        <p className={`text-sm ${state.success ? "text-emerald-500" : "text-destructive"}`}>
          {state.message}
        </p>
      )}
    </form>
  );
}

// Le lien de confirmation d'inscription revient ici avec la session dans le
// fragment d'URL (#access_token=...&refresh_token=...), lisible seulement
// côté client. On l'établit dès l'arrivée pour connecter automatiquement le
// parent, sans lui faire retaper son mot de passe.
function useSessionFromEmailLink() {
  const router = useRouter();
  // Démarre toujours à false, identique côté serveur et côté client : lire
  // window.location.hash dans l'état initial provoquerait un mismatch
  // d'hydratation (le serveur ne voit jamais ce hash). La détection se fait
  // uniquement après le montage, via l'effet ci-dessous.
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    // Tout passe par une microtâche pour que chaque mise à jour d'état
    // reste asynchrone par rapport au corps de l'effet.
    Promise.resolve().then(async () => {
      if (!window.location.hash.includes("access_token")) return;
      setConfirming(true);

      const params = new URLSearchParams(window.location.hash.slice(1));
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");
      window.history.replaceState(null, "", window.location.pathname + window.location.search);

      if (!access_token || !refresh_token) {
        setConfirming(false);
        return;
      }

      const supabase = createClient();
      const { error } = await supabase.auth.setSession({ access_token, refresh_token });
      if (error) {
        setConfirming(false);
        return;
      }
      router.replace("/espace-parent");
    });
  }, [router]);

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
          {error && <p className="text-sm text-destructive">{error.message}</p>}
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
      {error?.needsConfirmation && error.email && (
        <CardFooter>
          <ResendConfirmation email={error.email} />
        </CardFooter>
      )}
    </Card>
  );
}
