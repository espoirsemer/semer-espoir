import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/auth-actions";

type NavItem = {
  href: string;
  label: string;
};

export function AppSidebar({
  title,
  items,
  userLabel,
}: {
  title: string;
  items: NavItem[];
  userLabel?: string | null;
}) {
  return (
    <aside className="flex w-64 shrink-0 flex-col border-r bg-sidebar px-4 py-6 text-sidebar-foreground">
      <Link href="/" className="mb-6 text-lg font-semibold tracking-tight">
        Semer Espoir
      </Link>
      <p className="mb-2 px-2 text-xs font-medium uppercase text-muted-foreground">
        {title}
      </p>
      <nav className="flex flex-1 flex-col gap-1">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(buttonVariants({ variant: "ghost" }), "justify-start")}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <Separator className="my-4" />
      <div className="flex flex-col gap-2 px-2">
        {userLabel && (
          <p className="truncate text-sm text-muted-foreground">{userLabel}</p>
        )}
        <form action={signOut}>
          <Button type="submit" variant="outline" size="sm" className="w-full">
            Se déconnecter
          </Button>
        </form>
      </div>
    </aside>
  );
}
