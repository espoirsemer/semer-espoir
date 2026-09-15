"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PLAN_FEATURES, formatPrice } from "@/lib/pricing";
import type { SubscriptionPlan, SubscriptionTier } from "@/types/database.types";
import { Reveal } from "./reveal";

const HIGHLIGHTED_TIER: SubscriptionTier = "tier_2";

export function Pricing({ plans }: { plans: SubscriptionPlan[] }) {
  return (
    <section id="tarifs" className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Des formules pensées pour chaque besoin
        </h2>
        <p className="mt-3 text-muted-foreground">
          Changez ou annulez votre abonnement à tout moment.
        </p>
      </Reveal>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        variants={{ show: { transition: { staggerChildren: 0.12 } } }}
        className="mt-14 grid gap-6 lg:grid-cols-3"
      >
        {plans.map((plan) => {
          const highlighted = plan.key === HIGHLIGHTED_TIER;
          const meta = PLAN_FEATURES[plan.key];
          const ctaHref = plan.payment_link || "/inscription";
          const isExternal = Boolean(plan.payment_link);

          return (
            <motion.div
              key={plan.key}
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              whileHover={{ y: -6 }}
              className={cn(
                "flex flex-col rounded-2xl border p-7 shadow-sm transition-shadow hover:shadow-xl",
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
              <h3 className="text-lg font-medium">{plan.name}</h3>
              <p className="mt-3 text-3xl font-semibold tracking-tight">
                {formatPrice(plan)}
                {plan.price_amount != null && (
                  <span className="text-base font-normal text-muted-foreground">
                    /mois
                  </span>
                )}
              </p>
              <ul className="mt-6 flex-1 space-y-2.5">
                {meta.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              {isExternal ? (
                <a
                  href={ctaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ variant: highlighted ? "default" : "outline" }),
                    "mt-7 w-full",
                  )}
                >
                  Choisir {plan.name}
                </a>
              ) : (
                <Link
                  href={ctaHref}
                  className={cn(
                    buttonVariants({ variant: highlighted ? "default" : "outline" }),
                    "mt-7 w-full",
                  )}
                >
                  Choisir {plan.name}
                </Link>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
