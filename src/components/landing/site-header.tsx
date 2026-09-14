import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "#modules", label: "Ce que vous trouverez" },
  { href: "#specialiste", label: "L'experte" },
  { href: "#tarifs", label: "Tarifs" },
  { href: "#faq", label: "FAQ" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Semer Espoir
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/connexion"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            Connexion
          </Link>
          <Link
            href="/inscription"
            className={cn(buttonVariants({ size: "sm" }))}
          >
            Rejoindre
          </Link>
        </div>
      </div>
    </header>
  );
}
