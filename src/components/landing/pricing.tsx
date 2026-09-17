"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PLAN_FEATURES, formatPrice } from "@/lib/pricing";
import type { SubscriptionPlan } from "@/types/database.types";
import { Reveal } from "./reveal";

export function Pricing({ plans }: { plans: SubscriptionPlan[] }) {
  const plan = plans[0];
  if (!plan) return null;

  const meta = PLAN_FEATURES[plan.key];
  const ctaHref = plan.payment_link || "/inscription";
  const isExternal = Boolean(plan.payment_link);

  return (
    <section id="tarifs" className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Un abonnement simple pour rejoindre la communauté
        </h2>
        <p className="mt-3 text-muted-foreground">
          Changez ou annulez votre abonnement à tout moment.
        </p>
      </Reveal>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        whileHover={{ y: -6 }}
        className={cn(
          "mx-auto mt-14 flex max-w-md flex-col rounded-2xl border border-amber-300 bg-amber-50/60 p-8 shadow-lg transition-shadow hover:shadow-xl dark:border-amber-800 dark:bg-amber-950/20",
        )}
      >
        <h3 className="text-lg font-medium">{plan.name}</h3>
        <p className="mt-3 text-3xl font-semibold tracking-tight">
          {formatPrice(plan)}
          {plan.price_amount != null && (
            <span className="text-base font-normal text-muted-foreground">/mois</span>
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
            className={cn(buttonVariants({ variant: "default" }), "mt-7 w-full")}
          >
            Rejoindre {plan.name}
          </a>
        ) : (
          <Link
            href={ctaHref}
            className={cn(buttonVariants({ variant: "default" }), "mt-7 w-full")}
          >
            Rejoindre {plan.name}
          </Link>
        )}
      </motion.div>
    </section>
  );
}
