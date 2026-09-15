import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-muted-foreground">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Semer Espoir — Centre ANLE. Tous droits réservés.</p>
          <div className="flex gap-6">
            <Link href="/connexion" className="hover:text-foreground">
              Connexion
            </Link>
            <Link href="/inscription" className="hover:text-foreground">
              Inscription
            </Link>
            <a href="tel:+237695521300" className="hover:text-foreground">
              (+237) 695 52 13 00
            </a>
          </div>
        </div>
        <p className="mt-3 text-center text-xs text-muted-foreground/80 sm:text-left">
          Ndogpassi II, Douala — Cameroun
        </p>
      </div>
    </footer>
  );
}
