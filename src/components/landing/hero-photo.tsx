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
        className="overflow-hidden rounded-2xl border border-border/60 bg-muted shadow-2xl shadow-amber-900/10"
      >
        <Image
          src="/images/hero-enfants.jpg"
          alt="Une éducatrice du centre ANLE joue avec un groupe d'enfants à besoins spécifiques"
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
        className="absolute -right-6 -bottom-8 w-56 rounded-xl border border-border/60 bg-background p-3.5 shadow-xl sm:-right-10"
      >
        <div className="flex items-start gap-2">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
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
