import Link from "next/link";
import { Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SUBSCRIPTION_TIERS } from "@/lib/stripe/config";

const HIGHLIGHTED_TIER: keyof typeof SUBSCRIPTION_TIERS = "tier_2";

export function Pricing() {
  return (
    <section id="tarifs" className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Des formules pensées pour chaque besoin
        </h2>
        <p className="mt-3 text-muted-foreground">
          Changez ou annulez votre abonnement à tout moment.
        </p>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {Object.values(SUBSCRIPTION_TIERS).map((tier) => {
          const highlighted = tier.key === HIGHLIGHTED_TIER;
          return (
            <div
              key={tier.key}
              className={cn(
                "flex flex-col rounded-2xl border p-7",
                highlighted
                  ? "border-amber-300 bg-amber-50/60 shadow-lg lg:-translate-y-3 dark:border-amber-800 dark:bg-amber-950/20"
                  : "border-border/60 bg-background",
              )}
            >
              {highlighted && (
                <span className="mb-3 inline-flex w-fit items-center rounded-full bg-amber-600 px-2.5 py-0.5 text-xs font-medium text-white">
                  Le plus choisi
                </span>
              )}
              <h3 className="text-lg font-medium">{tier.name}</h3>
              <p className="mt-3 text-3xl font-semibold tracking-tight">
                [Prix]
                <span className="text-base font-normal text-muted-foreground">
                  /mois
                </span>
              </p>
              <ul className="mt-6 flex-1 space-y-2.5">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/inscription"
                className={cn(
                  buttonVariants({ variant: highlighted ? "default" : "outline" }),
                  "mt-7 w-full",
                )}
              >
                Choisir {tier.name}
              </Link>
            </div>
          );
        })}
      </div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        [Placeholder — tarifs à confirmer avant l&apos;ouverture des inscriptions.]
      </p>
    </section>
  );
}
