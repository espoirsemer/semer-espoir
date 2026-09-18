"use client";

import { useActionState } from "react";
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
import { requestPasswordReset } from "./actions";

export default function MotDePasseOubliePage() {
  const [state, formAction, isPending] = useActionState(requestPasswordReset, null);

  if (state === "success") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Vérifiez votre boîte mail</CardTitle>
          <CardDescription>
            Si un compte existe avec cette adresse, un lien de réinitialisation
            vous a été envoyé.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Link href="/connexion" className="text-sm underline underline-offset-4">
            Retour à la connexion
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mot de passe oublié</CardTitle>
        <CardDescription>
          Entrez votre e-mail, nous vous enverrons un lien pour le réinitialiser.
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" name="email" type="email" required autoComplete="email" />
          </div>
          {state === "rate_limited" && (
            <p className="text-sm text-destructive">
              Trop de tentatives. Réessayez dans quelques minutes.
            </p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Envoi..." : "Envoyer le lien"}
          </Button>
          <Link
            href="/connexion"
            className="text-sm text-muted-foreground underline underline-offset-4"
          >
            Retour à la connexion
          </Link>
        </CardFooter>
      </form>
    </Card>
  );
}
