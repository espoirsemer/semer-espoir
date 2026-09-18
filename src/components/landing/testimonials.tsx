"use client";

import { motion } from "motion/react";
import { Quote, Star } from "lucide-react";
import { Reveal } from "./reveal";

const TESTIMONIALS = [
  {
    quote:
      "Depuis que j'ai rejoint la communauté, je ne me sens plus seule face aux crises de mon fils. Les autres parents comprennent vraiment ce qu'on vit, et leurs conseils du quotidien m'ont énormément aidée.",
    name: "Solange Nkeng",
    role: "maman de Junior, 6 ans (autisme)",
  },
  {
    quote:
      "Les vidéos de formation sont concrètes et faciles à appliquer, même le soir après une longue journée. Le planning à pictogrammes a changé nos matins — Grace s'habille presque seule maintenant.",
    name: "Patrick Fotso",
    role: "papa de Grace, 4 ans (trisomie 21)",
  },
  {
    quote:
      "Le journal de bord m'a permis de voir les progrès de ma fille sur plusieurs semaines, des choses que je ne remarquais pas au jour le jour. Ça aide aussi beaucoup la spécialiste à mieux la suivre.",
    name: "Larissa Mbah",
    role: "maman de Divine, 7 ans (IMC)",
  },
];

export function Testimonials() {
  return (
    <section className="bg-black/20">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            Ce qu&apos;en disent les familles
          </h2>
        </Reveal>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ show: { transition: { staggerChildren: 0.12 } } }}
          className="mt-12 grid gap-6 sm:grid-cols-3"
        >
          {TESTIMONIALS.map((t) => (
            <motion.div
              key={t.name}
              variants={{
                hidden: { opacity: 0, y: 24 },
                show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              whileHover={{ y: -4 }}
              className="flex flex-col rounded-2xl border border-border/60 bg-background p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <Quote className="size-6 text-lime-400" />
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="size-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
              <p className="mt-4 flex-1 text-sm text-muted-foreground italic">
                « {t.quote} »
              </p>
              <p className="mt-4 text-sm font-medium">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.role}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
