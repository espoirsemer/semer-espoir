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
  },
  {
    icon: MessagesSquare,
    title: "Ne plus être seul·e",
    description:
      "Une communauté privée de parents qui vivent la même chose que vous, organisée par sujets : sommeil, alimentation, scolarité, petites victoires.",
    tint: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
    dot: "bg-emerald-700",
  },
  {
    icon: LineChart,
    title: "Suivre les progrès",
    description:
      "Un journal de bord quotidien qui prend moins d'une minute, et qui révèle des tendances utiles pour vous et pour la spécialiste.",
    tint: "bg-sky-100 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300",
    dot: "bg-sky-700",
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
        <div
          aria-hidden
          className="absolute top-7 right-[16.5%] left-[16.5%] hidden border-t-2 border-dashed border-border sm:block"
        />
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ show: { transition: { staggerChildren: 0.15 } } }}
          className="relative grid gap-10 sm:grid-cols-3"
        >
          {PILLARS.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              variants={{
                hidden: { opacity: 0, scale: 0.9, y: 20 },
                show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5 } },
              }}
              className="flex flex-col items-center text-center"
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
