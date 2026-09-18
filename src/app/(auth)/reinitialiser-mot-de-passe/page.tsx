"use client";

import { useEffect, useState, type FormEvent } from "react";
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

type Status = "checking" | "ready" | "invalid";

// Le lien de réinitialisation revient ici avec la session dans le fragment
// d'URL (#access_token=...&type=recovery), lisible seulement côté client —
// même contrainte que la confirmation d'inscription (voir /connexion).
function useSessionFromRecoveryLink() {
  const [status, setStatus] = useState<Status>("checking");

  useEffect(() => {
    Promise.resolve().then(async () => {
      if (!window.location.hash.includes("access_token")) {
        setStatus("invalid");
        return;
      }

      const params = new URLSearchParams(window.location.hash.slice(1));
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");
      window.history.replaceState(null, "", window.location.pathname + window.location.search);

      if (!access_token || !refresh_token) {
        setStatus("invalid");
        return;
      }

      const supabase = createClient();
      const { error } = await supabase.auth.setSession({ access_token, refresh_token });
      setStatus(error ? "invalid" : "ready");
    });
  }, []);

  return status;
}

export default function ReinitialiserMotDePassePage() {
  const router = useRouter();
  const status = useSessionFromRecoveryLink();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setIsSubmitting(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setIsSubmitting(false);
      setError("Impossible de mettre à jour le mot de passe. Réessayez.");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/connexion");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    router.replace(profile?.role === "admin" ? "/admin" : "/espace-parent");
  }

  if (status === "checking") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Un instant…</CardTitle>
          <CardDescription>Vérification du lien de réinitialisation.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (status === "invalid") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Lien invalide ou expiré</CardTitle>
          <CardDescription>
            Ce lien de réinitialisation n&apos;est plus valide. Demandez-en un
            nouveau.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Link
            href="/mot-de-passe-oublie"
            className="text-sm underline underline-offset-4"
          >
            Réinitialiser mon mot de passe
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nouveau mot de passe</CardTitle>
        <CardDescription>Choisissez un nouveau mot de passe.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Nouveau mot de passe</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
            <Input
              id="confirmPassword"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Mise à jour..." : "Mettre à jour le mot de passe"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
