import { BarChart3, Tag, PlayCircle, ShieldCheck, Users, CalendarClock, Video, Home } from "lucide-react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { CommunityNotifier } from "@/components/community/community-notifier";
import { ConsultationNotifier } from "@/components/consultations/consultation-notifier";
import { requireAdmin } from "@/lib/auth";

const ADMIN_NAV = [
  { href: "/admin", label: "Vue Business", icon: <BarChart3 /> },
  { href: "/admin/tarifs", label: "Tarifs", icon: <Tag /> },
  { href: "/admin/contenus", label: "Contenus", icon: <PlayCircle /> },
  { href: "/admin/communaute", label: "Modération", icon: <ShieldCheck /> },
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
    <div className="flex h-screen overflow-hidden">
      <CommunityNotifier profileId={profile.id} />
      <ConsultationNotifier profileId={profile.id} role="admin" />
      <AppSidebar
        title="Panel Admin"
        items={ADMIN_NAV}
        userLabel={profile.full_name}
      />
      <main className="min-h-0 flex-1 overflow-y-auto bg-muted/30 p-8">{children}</main>
    </div>
  );
}
