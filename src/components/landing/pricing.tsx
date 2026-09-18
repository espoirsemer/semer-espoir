"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Check, Sparkles } from "lucide-react";
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
        <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
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
        className="mx-auto mt-14 max-w-md rounded-[28px] bg-gradient-to-br from-amber-400 via-lime-400 to-lime-500 p-[1.5px] shadow-xl shadow-black/30"
      >
        <div className="flex h-full flex-col rounded-[26.5px] bg-background p-8">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-lime-500/15 px-2.5 py-1 text-xs font-medium text-lime-400">
            <Sparkles className="size-3.5" />
            Formule unique
          </span>
          <h3 className="font-heading mt-4 text-lg font-medium">{plan.name}</h3>
          <p className="mt-2 text-4xl font-semibold tracking-tight">
            {formatPrice(plan)}
            {plan.price_amount != null && (
              <span className="text-base font-normal text-muted-foreground">/mois</span>
            )}
          </p>
          <ul className="mt-6 flex-1 space-y-2.5">
            {meta.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 size-4 shrink-0 text-lime-400" />
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
              Rejoindre la communauté
            </a>
          ) : (
            <Link
              href={ctaHref}
              className={cn(buttonVariants({ variant: "default" }), "mt-7 w-full")}
            >
              Rejoindre la communauté
            </Link>
          )}
        </div>
      </motion.div>
    </section>
  );
}
