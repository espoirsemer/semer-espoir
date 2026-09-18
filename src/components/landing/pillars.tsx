"use client";

import { motion } from "motion/react";
import { GraduationCap, MessagesSquare, LineChart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

const PILLARS = [
  {
    icon: GraduationCap,
    title: "Vous former",
    description:
      "Des vidéos et des ressources terrain conçues par l'équipe du centre ANLE, pour agir avec des outils qui fonctionnent vraiment.",
    tint: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
    dot: "bg-amber-600",
    card: "border-amber-200/70 bg-amber-50/60 dark:border-amber-900/50 dark:bg-amber-950/10",
  },
  {
    icon: MessagesSquare,
    title: "Ne plus être seul·e",
    description:
      "Une communauté privée de parents qui vivent la même chose que vous, organisée par sujets : sommeil, alimentation, scolarité, petites victoires.",
    tint: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
    dot: "bg-emerald-700",
    card: "border-emerald-200/70 bg-emerald-50/60 dark:border-emerald-900/50 dark:bg-emerald-950/10",
  },
  {
    icon: LineChart,
    title: "Suivre les progrès",
    description:
      "Un journal de bord quotidien qui prend moins d'une minute, et qui révèle des tendances utiles pour vous et pour la spécialiste.",
    tint: "bg-sky-100 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300",
    dot: "bg-sky-700",
    card: "border-sky-200/70 bg-sky-50/60 dark:border-sky-900/50 dark:bg-sky-950/10",
  },
];

export function Pillars() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
          Un accompagnement à trois piliers
        </h2>
        <p className="mt-3 text-muted-foreground">
          Parce que le handicap de votre enfant se vit au quotidien, pas
          seulement en consultation.
        </p>
      </Reveal>

      <div className="relative mt-16">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ show: { transition: { staggerChildren: 0.15 } } }}
          className="relative grid gap-6 sm:grid-cols-3"
        >
          {PILLARS.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              variants={{
                hidden: { opacity: 0, scale: 0.9, y: 20 },
                show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5 } },
              }}
              whileHover={{ y: -4 }}
              className={cn(
                "flex flex-col items-center rounded-3xl border p-8 text-center shadow-sm transition-shadow hover:shadow-md",
                pillar.card,
              )}
            >
              <motion.div
                whileHover={{ scale: 1.08, rotate: -4 }}
                className={cn(
                  "relative z-10 flex size-14 items-center justify-center rounded-2xl shadow-sm ring-4 ring-background",
                  pillar.tint,
                )}
              >
                <pillar.icon className="size-7" />
                <span
                  className={cn(
                    "absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full text-[11px] font-semibold text-white",
                    pillar.dot,
                  )}
                >
                  {i + 1}
                </span>
              </motion.div>
              <h3 className="font-heading mt-5 text-lg font-medium">{pillar.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
