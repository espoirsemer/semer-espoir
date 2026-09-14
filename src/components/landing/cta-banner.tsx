"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

export function CtaBanner() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20 sm:py-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-600 to-orange-600 px-8 py-14 text-center text-white sm:px-16">
          <motion.div
            aria-hidden
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-16 -left-16 size-64 rounded-full bg-white/10 blur-2xl"
          />
          <motion.div
            aria-hidden
            animate={{ x: [0, -20, 0], y: [0, 25, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-10 -bottom-16 size-64 rounded-full bg-white/10 blur-2xl"
          />

          <div className="relative">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Prêt·e à ne plus avancer seul&#8239;·&#8239;e ?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-amber-50">
              Rejoignez une communauté de parents qui se comprennent, et
              donnez à votre enfant les outils dont il a besoin dès
              aujourd&apos;hui.
            </p>
            <Link
              href="/inscription"
              className={cn(
                buttonVariants({ size: "lg" }),
                "mt-7 bg-white px-8 text-amber-700 hover:bg-amber-50",
              )}
            >
              Rejoindre la communauté
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
