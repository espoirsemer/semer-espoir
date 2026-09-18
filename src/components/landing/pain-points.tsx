"use client";

import { motion } from "motion/react";
import { CloudRain, EarOff, HelpCircle, Users2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

const STATEMENTS = [
  {
    icon: EarOff,
    text: "Vous cherchez des réponses concrètes, pas juste de la théorie.",
    tint: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400",
    card: "border-amber-200/80 bg-amber-50/70 dark:border-amber-900/60 dark:bg-amber-950/20",
  },
  {
    icon: CloudRain,
    text: "Vous vous sentez seul·e face aux crises, aux regards, à l'incompréhension.",
    tint: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400",
    card: "border-emerald-200/80 bg-emerald-50/70 dark:border-emerald-900/60 dark:bg-emerald-950/20",
  },
  {
    icon: HelpCircle,
    text: "Vous ne savez jamais si ce que vous faites au quotidien est vraiment adapté.",
    tint: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400",
    card: "border-emerald-200/80 bg-emerald-50/70 dark:border-emerald-900/60 dark:bg-emerald-950/20",
  },
  {
    icon: Users2,
    text: "Vous aimeriez qu'une spécialiste suive vraiment l'évolution de votre enfant.",
    tint: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400",
    card: "border-amber-200/80 bg-amber-50/70 dark:border-amber-900/60 dark:bg-amber-950/20",
  },
];

export function PainPoints() {
  return (
    <section className="bg-gradient-to-b from-stone-100 to-stone-50 dark:from-stone-900 dark:to-stone-950">
      <div className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
        <Reveal>
          <h2 className="font-heading text-center text-2xl font-semibold tracking-tight sm:text-3xl">
            Est-ce que ça vous parle ?
          </h2>
        </Reveal>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ show: { transition: { staggerChildren: 0.1 } } }}
          className="mt-10 grid gap-4 sm:grid-cols-2"
        >
          {STATEMENTS.map((item) => (
            <motion.div
              key={item.text}
              variants={{
                hidden: { opacity: 0, y: 24 },
                show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              whileHover={{ y: -4 }}
              className={cn(
                "flex items-start gap-4 rounded-2xl border p-6 shadow-sm transition-shadow hover:shadow-md",
                item.card,
              )}
            >
              <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", item.tint)}>
                <item.icon className="size-5" />
              </div>
              <p className="pt-1.5 text-lg">{item.text}</p>
            </motion.div>
          ))}
        </motion.div>

        <Reveal delay={0.2}>
          <p className="mt-10 text-center text-lg text-muted-foreground">
            Vous n&apos;êtes pas seul&#8239;·&#8239;e à ressentir ça — et il
            existe un accompagnement pensé pour vous.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
