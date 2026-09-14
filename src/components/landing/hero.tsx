import Link from "next/link";
import { Sprout } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-[32rem] bg-gradient-to-b from-amber-100/70 via-amber-50/40 to-transparent dark:from-amber-950/30 dark:via-amber-950/10"
      />

      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 pt-20 pb-16 text-center sm:pt-28 sm:pb-24">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          <Sprout className="size-4" />
          Formation, communauté et suivi pour les familles concernées par l&apos;autisme
        </div>

        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
          Vous n&apos;avez pas à traverser ça seul&#8239;·&#8239;e
        </h1>

        <p className="max-w-2xl text-lg text-muted-foreground text-balance sm:text-xl">
          Semer Espoir accompagne au quotidien les parents d&apos;enfants autistes :
          des formations concrètes, une communauté qui comprend, et un suivi
          clinique à distance avec une spécialiste — où que vous soyez dans le
          monde.
        </p>

        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/inscription"
            className={cn(buttonVariants({ size: "lg" }), "px-8")}
          >
            Rejoindre la communauté
          </Link>
          <Link
            href="#tarifs"
            className={cn(buttonVariants({ size: "lg", variant: "outline" }), "px-8")}
          >
            Découvrir les formules
          </Link>
        </div>

        <p className="text-sm text-muted-foreground">
          Déjà des familles accompagnées à travers le monde francophone.
        </p>
      </div>
    </section>
  );
}
