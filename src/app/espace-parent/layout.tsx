import { AppSidebar } from "@/components/layout/app-sidebar";
import { requireProfile } from "@/lib/auth";

const PARENT_NAV = [
  { href: "/espace-parent", label: "Accueil" },
  { href: "/espace-parent/hub", label: "Hub de contenu" },
  { href: "/espace-parent/communaute", label: "Communauté" },
  { href: "/espace-parent/journal", label: "Journal de bord" },
  { href: "/espace-parent/profil", label: "Profil de l'enfant" },
];

export default async function EspaceParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireProfile();
  const navItems =
    profile.role === "admin"
      ? [...PARENT_NAV, { href: "/admin", label: "Panel Admin" }]
      : PARENT_NAV;

  return (
    <div className="flex flex-1">
      <AppSidebar
        title="Espace parent"
        items={navItems}
        userLabel={profile.full_name}
      />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
