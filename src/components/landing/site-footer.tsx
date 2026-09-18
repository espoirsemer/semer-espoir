import Link from "next/link";
import { Sprout } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="bg-[oklch(0.12_0.03_258)] text-slate-400">
      <div className="mx-auto max-w-6xl px-6 py-12 text-sm">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2 text-slate-100">
            <span className="flex size-7 items-center justify-center rounded-lg bg-lime-500/15 text-lime-400">
              <Sprout className="size-4" />
            </span>
            <span className="font-heading text-base font-medium">Semer Espoir</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link href="/connexion" className="transition-colors hover:text-slate-100">
              Connexion
            </Link>
            <Link href="/inscription" className="transition-colors hover:text-slate-100">
              Inscription
            </Link>
            <a href="tel:+237695521300" className="transition-colors hover:text-slate-100">
              (+237) 695 52 13 00
            </a>
          </div>
        </div>
        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-slate-800 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Semer Espoir — Centre ANLE. Tous droits réservés.</p>
          <p>Ndogpassi II, Douala — Cameroun</p>
        </div>
      </div>
    </footer>
  );
}
