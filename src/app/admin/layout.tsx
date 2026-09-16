import { BarChart3, Tag, PlayCircle, ShieldCheck, Users, CalendarClock, Video, MessageCircle, Home } from "lucide-react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { requireAdmin } from "@/lib/auth";

const ADMIN_NAV = [
  { href: "/admin", label: "Vue Business", icon: <BarChart3 /> },
  { href: "/admin/tarifs", label: "Tarifs", icon: <Tag /> },
  { href: "/admin/contenus", label: "Contenus", icon: <PlayCircle /> },
  { href: "/admin/communaute", label: "Modération", icon: <ShieldCheck /> },
  { href: "/admin/messagerie", label: "Messagerie", icon: <MessageCircle /> },
  { href: "/admin/lives", label: "Lives Q&A", icon: <Video /> },
  { href: "/admin/consultations", label: "Consultations", icon: <CalendarClock /> },
  { href: "/admin/abonnes", label: "Abonnés", icon: <Users /> },
  { href: "/espace-parent", label: "Espace parent", icon: <Home /> },
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
      <main className="flex-1 overflow-y-auto bg-muted/30 p-8">{children}</main>
    </div>
  );
}
