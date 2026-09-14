"use client";

import { motion } from "motion/react";
import { Area, AreaChart, ResponsiveContainer, YAxis } from "recharts";
import { MessageCircle, TrendingDown } from "lucide-react";
import { EASE } from "./reveal";

const ANXIETY_TREND = [
  { day: 1, level: 4 },
  { day: 2, level: 3.6 },
  { day: 3, level: 3.8 },
  { day: 4, level: 3.2 },
  { day: 5, level: 2.9 },
  { day: 6, level: 3.1 },
  { day: 7, level: 2.4 },
  { day: 8, level: 2.6 },
  { day: 9, level: 2.1 },
  { day: 10, level: 1.9 },
];

export function ProductMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotate: -2 }}
      animate={{ opacity: 1, y: 0, rotate: -2 }}
      transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
      className="relative mx-auto w-full max-w-md"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="overflow-hidden rounded-2xl border border-border/60 bg-background shadow-2xl shadow-amber-900/10"
      >
        <div className="flex items-center gap-1.5 border-b border-border/60 bg-muted/40 px-4 py-3">
          <span className="size-2.5 rounded-full bg-red-300" />
          <span className="size-2.5 rounded-full bg-amber-300" />
          <span className="size-2.5 rounded-full bg-green-300" />
          <span className="ml-3 text-xs text-muted-foreground">
            Journal de bord — Léo
          </span>
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">
                Niveau d&apos;anxiété — 10 derniers jours
              </p>
              <p className="mt-1 text-2xl font-semibold">1,9 / 5</p>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
              <TrendingDown className="size-3.5" />
              En baisse
            </span>
          </div>

          <div className="mt-3 h-28">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ANXIETY_TREND} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="anxietyFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <YAxis domain={[0, 5]} hide />
                <Area
                  type="monotone"
                  dataKey="level"
                  stroke="#d97706"
                  strokeWidth={2.5}
                  fill="url(#anxietyFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
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
