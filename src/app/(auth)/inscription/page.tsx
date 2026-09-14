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
import { signUp } from "./actions";

export default function InscriptionPage() {
  const [state, formAction, isPending] = useActionState(signUp, null);

  if (state === "success") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Vérifiez votre boîte mail</CardTitle>
          <CardDescription>
            Un e-mail de confirmation vous a été envoyé. Cliquez sur le lien
            pour activer votre compte parent.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Créer un compte</CardTitle>
        <CardDescription>Rejoignez l&apos;espace parent Semer Espoir.</CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Nom complet</Label>
            <Input id="fullName" name="fullName" required autoComplete="name" />
          </div>
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
              minLength={8}
              autoComplete="new-password"
            />
          </div>
          {state && state !== "success" && (
            <p className="text-sm text-destructive">{state}</p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Création..." : "Créer mon compte"}
          </Button>
          <p className="text-sm text-muted-foreground">
            Déjà inscrit ?{" "}
            <Link href="/connexion" className="underline underline-offset-4">
              Connectez-vous
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
