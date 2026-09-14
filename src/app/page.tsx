import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { SUBSCRIPTION_TIERS } from "@/lib/stripe/config";

const MODULES = [
  {
    title: "Hub de contenu",
    description: "Vidéothèque et boîte à outils PDF pour accompagner votre enfant au quotidien.",
  },
  {
    title: "Communauté privée",
    description: "Échangez avec d'autres parents par canaux thématiques : sommeil, scolarité, alimentation…",
  },
  {
    title: "Journal de bord",
    description: "Un suivi quotidien en moins d'une minute, avec des tendances visualisées dans le temps.",
  },
];

export default function LandingPage() {
  return (
    <main className="flex-1">
      <section className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 py-24 text-center">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Semer Espoir
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          La plateforme qui accompagne les familles autour de l&apos;autisme :
          formation, entraide entre parents et suivi clinique à distance.
        </p>
        <div className="flex gap-3">
          <Link href="/inscription" className={buttonVariants({ size: "lg" })}>
            Rejoindre la communauté
          </Link>
          <Link
            href="/connexion"
            className={buttonVariants({ size: "lg", variant: "outline" })}
          >
            Se connecter
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-4 px-6 pb-16 sm:grid-cols-3">
        {MODULES.map((module) => (
          <Card key={module.title}>
            <CardHeader>
              <CardTitle>{module.title}</CardTitle>
              <CardDescription>{module.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-24">
        <h2 className="mb-6 text-center text-2xl font-semibold">
          Nos formules d&apos;accompagnement
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {Object.values(SUBSCRIPTION_TIERS).map((tier) => (
            <Card key={tier.key}>
              <CardHeader>
                <CardTitle>{tier.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {tier.features.map((feature) => (
                    <li key={feature}>• {feature}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
