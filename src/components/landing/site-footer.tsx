import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-10 text-sm text-muted-foreground sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} Semer Espoir. Tous droits réservés.</p>
        <div className="flex gap-6">
          <Link href="/connexion" className="hover:text-foreground">
            Connexion
          </Link>
          <Link href="/inscription" className="hover:text-foreground">
            Inscription
          </Link>
          <a href="mailto:contact@semerespoir.com" className="hover:text-foreground">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
