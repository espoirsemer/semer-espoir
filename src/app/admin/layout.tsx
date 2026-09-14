import { AppSidebar } from "@/components/layout/app-sidebar";
import { requireAdmin } from "@/lib/auth";

const ADMIN_NAV = [
  { href: "/admin", label: "Vue Business" },
  { href: "/admin/contenus", label: "Contenus" },
  { href: "/admin/communaute", label: "Modération" },
  { href: "/admin/abonnes", label: "Abonnés" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireAdmin();

  return (
    <div className="flex flex-1">
      <AppSidebar
        title="Panel Admin"
        items={ADMIN_NAV}
        userLabel={profile.full_name}
      />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
