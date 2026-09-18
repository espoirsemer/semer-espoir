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
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[oklch(0.12_0.03_258)] px-8 py-14 text-center text-white sm:px-16">
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] bg-[size:28px_28px]"
          />
          <motion.div
            aria-hidden
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-16 -left-16 size-64 rounded-full bg-lime-500/25 blur-2xl"
          />
          <motion.div
            aria-hidden
            animate={{ x: [0, -20, 0], y: [0, 25, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-10 -bottom-16 size-64 rounded-full bg-amber-500/15 blur-2xl"
          />

          <div className="relative">
            <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
              Prêt·e à ne plus avancer seul&#8239;·&#8239;e ?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-300">
              Rejoignez une communauté de parents qui se comprennent, et
              donnez à votre enfant les outils dont il a besoin dès
              aujourd&apos;hui.
            </p>
            <Link
              href="/inscription"
              className={cn(
                buttonVariants({ size: "lg" }),
                "mt-7 bg-lime-500 px-8 text-[oklch(0.15_0.03_258)] hover:bg-lime-400",
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
