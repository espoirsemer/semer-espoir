"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { MessageCircle } from "lucide-react";
import { EASE } from "./reveal";

export function HeroPhoto() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotate: -2 }}
      animate={{ opacity: 1, y: 0, rotate: -2 }}
      transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
      className="relative mx-auto w-full max-w-lg"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="overflow-hidden rounded-2xl border border-border/60 bg-muted shadow-2xl shadow-black/40"
      >
        <Image
          src="/images/hero-enfants.jpg"
          alt="Une éducatrice joue avec un groupe d'enfants à besoins spécifiques"
          width={1448}
          height={1086}
          className="aspect-4/3 w-full object-cover"
          priority
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 30, y: 20 }}
        animate={{ opacity: 1, x: 0, y: [0, 8, 0] }}
        transition={{
          opacity: { duration: 0.6, delay: 0.9 },
          x: { duration: 0.6, delay: 0.9 },
          y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 },
        }}
        className="absolute -right-2 -bottom-6 w-48 rounded-xl border border-border/60 bg-background p-3.5 shadow-xl sm:-right-10 sm:-bottom-8 sm:w-56"
      >
        <div className="flex items-start gap-2">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-lime-500/15 text-lime-400">
            <MessageCircle className="size-3.5" />
          </div>
          <div>
            <p className="text-xs font-medium">#petites-victoires</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              &laquo;&nbsp;Premier repas sans crise depuis 3 semaines !&nbsp;&raquo;
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
