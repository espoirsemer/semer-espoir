"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sprout, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/auth-actions";

export type NavItem = {
  href: string;
  label: string;
  icon: ReactNode;
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
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col overflow-hidden bg-[oklch(0.13_0.03_258)] px-4 py-6 text-slate-300">
      <Link href="/" className="mb-7 flex shrink-0 items-center gap-2 px-2 text-lg font-semibold tracking-tight text-white">
        <span className="flex size-7 items-center justify-center rounded-lg bg-lime-500 text-[oklch(0.15_0.03_258)]">
          <Sprout className="size-4" />
        </span>
        Semer Espoir
      </Link>
      <p className="mb-2 shrink-0 px-2 text-xs font-semibold tracking-widest text-slate-500 uppercase">
        {title}
      </p>
      <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto">
        {items.map((item) => {
          const isActive =
            item.href === pathname ||
            (item.href !== "/" &&
              item.href !== "/espace-parent" &&
              item.href !== "/admin" &&
              pathname.startsWith(item.href + "/"));
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors [&_svg]:size-4 [&_svg]:shrink-0",
                isActive
                  ? "bg-lime-500 text-[oklch(0.15_0.03_258)] shadow-sm shadow-lime-900/40"
                  : "text-slate-300 hover:bg-slate-800/70 hover:text-white",
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-4 flex shrink-0 flex-col gap-3 border-t border-slate-800 px-2 pt-4">
        {userLabel && (
          <p className="truncate text-sm text-slate-400">{userLabel}</p>
        )}
        <form action={signOut}>
          <button
            type="submit"
            className="flex w-full items-center gap-2 rounded-lg border border-slate-800 px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-slate-800/70 hover:text-white"
          >
            <LogOut className="size-4" />
            Se déconnecter
          </button>
        </form>
      </div>
    </aside>
  );
}
