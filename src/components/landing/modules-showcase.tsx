"use client";

import { motion } from "motion/react";
import { Check, PlayCircle, Users, NotebookPen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

const MODULES = [
  {
    icon: PlayCircle,
    title: "Le Hub de contenu",
    description:
      "Votre vidéothèque et votre boîte à outils, disponibles quand vous en avez besoin.",
    features: [
      "Vidéos de formation classées par thème",
      "Routines visuelles et plannings à pictogrammes prêts à imprimer",
      "Suivi de votre progression module par module",
    ],
  },
  {
    icon: Users,
    title: "La Communauté privée",
    description:
      "Un espace bienveillant pour poser vos questions sans jugement.",
    features: [
      "Canaux thématiques : sommeil, alimentation, scolarité…",
      "Fils de discussion et petites victoires du quotidien",
      "Lives Q&A avec la spécialiste (bientôt disponible)",
    ],
  },
  {
    icon: NotebookPen,
    title: "Le Journal de bord",
    description:
      "Un suivi quotidien de moins d'une minute qui éclaire les progrès de votre enfant.",
    features: [
      "Niveau d'anxiété et déclencheurs en quelques clics",
      "Courbes de tendance sur le mois",
      "Analyse par la spécialiste avant vos consultations (bientôt disponible)",
    ],
  },
];

export function ModulesShowcase() {
  return (
    <section id="modules" className="relative overflow-hidden bg-muted/30">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Ce que vous trouverez dans votre espace
          </h2>
        </Reveal>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ show: { transition: { staggerChildren: 0.12 } } }}
          className="mt-14 grid gap-6 lg:grid-cols-3"
        >
          {MODULES.map((module, i) => (
            <motion.div
              key={module.title}
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              whileHover={{ y: -4 }}
              className={cn(
                "flex flex-col rounded-2xl border border-border/60 bg-background p-7 shadow-sm transition-shadow hover:shadow-lg",
                i === 1 && "lg:-translate-y-3",
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex size-11 items-center justify-center rounded-xl bg-muted text-amber-700 dark:text-amber-400">
                  <module.icon className="size-5.5" />
                </div>
                <span className="font-mono text-xs text-muted-foreground/70 tabular-nums">
                  0{i + 1}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-medium">{module.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {module.description}
              </p>
              <ul className="mt-5 space-y-2.5 border-t border-border/60 pt-5">
                {module.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
