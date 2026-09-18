"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Sprout } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HeroPhoto } from "./hero-photo";
import { EASE } from "./reveal";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden bg-gradient-to-br from-amber-100 via-orange-50 to-emerald-100 dark:from-stone-950 dark:via-stone-950 dark:to-emerald-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(120,90,40,0.15)_1px,transparent_0)] bg-[size:32px_32px]" />
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 -left-24 size-[30rem] rounded-full bg-amber-400/40 blur-3xl dark:bg-amber-700/20"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 -right-32 size-[34rem] rounded-full bg-emerald-400/35 blur-3xl dark:bg-emerald-700/20"
        />
        <motion.div
          animate={{ x: [0, 20, 0], y: [0, -25, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-32 left-1/3 size-[26rem] rounded-full bg-orange-300/30 blur-3xl dark:bg-orange-800/15"
        />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 pt-20 pb-20 sm:pt-28 sm:pb-28 lg:grid-cols-[1.1fr_1fr] lg:gap-8">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.12 } } }}
          className="flex flex-col items-center text-center lg:items-start lg:text-left"
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200"
          >
            <Sprout className="size-4" />
            Formation, communauté et suivi pour les familles d&apos;enfants à besoins spécifiques
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="font-heading mt-6 text-4xl font-semibold tracking-tight text-balance sm:text-6xl"
          >
            Vous n&apos;avez pas à traverser ça{" "}
            <span className="text-amber-700 dark:text-amber-400">seul&#8239;·&#8239;e</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-5 max-w-xl text-lg text-muted-foreground text-balance sm:text-xl"
          >
            Semer Espoir accompagne au quotidien les parents d&apos;enfants
            autistes, trisomiques, IMC ou porteurs de troubles
            neurodéveloppementaux : des formations concrètes, une communauté
            qui comprend, et un suivi clinique à distance avec une
            spécialiste — où que vous soyez dans le monde.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/inscription"
              className={cn(buttonVariants({ size: "lg" }), "px-8")}
            >
              Rejoindre la communauté
            </Link>
            <Link
              href="#tarifs"
              className={cn(buttonVariants({ size: "lg", variant: "outline" }), "px-8")}
            >
              Découvrir l&apos;abonnement
            </Link>
          </motion.div>
        </motion.div>

        <div className="mt-6 lg:mt-0">
          <HeroPhoto />
        </div>
      </div>
    </section>
  );
}
