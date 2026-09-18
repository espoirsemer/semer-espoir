"use client";

import { motion } from "motion/react";
import { Quote, Star } from "lucide-react";
import { Reveal } from "./reveal";

const PLACEHOLDER_COUNT = 3;

export function Testimonials() {
  return (
    <section className="bg-black/20">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            Ce qu&apos;en disent les familles
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            [Placeholder — à remplacer par de vrais témoignages avant la mise
            en ligne publique.]
          </p>
        </Reveal>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ show: { transition: { staggerChildren: 0.12 } } }}
          className="mt-12 grid gap-6 sm:grid-cols-3"
        >
          {Array.from({ length: PLACEHOLDER_COUNT }).map((_, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 24 },
                show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              whileHover={{ y: -4 }}
              className="flex flex-col rounded-2xl border border-dashed border-border bg-background p-6 shadow-sm"
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
                « [Témoignage à venir — expérience concrète d&apos;un parent
                avec Semer Espoir.] »
              </p>
              <p className="mt-4 text-sm font-medium">[Prénom], parent</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
