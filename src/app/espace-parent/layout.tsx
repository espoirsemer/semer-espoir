import {
  Home,
  PlayCircle,
  MessagesSquare,
  MessageCircle,
  CalendarClock,
  Video,
  NotebookPen,
  UserRound,
  ShieldCheck,
} from "lucide-react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { CommunityNotifier } from "@/components/community/community-notifier";
import { requireProfile } from "@/lib/auth";

const PARENT_NAV = [
  { href: "/espace-parent", label: "Accueil", icon: <Home /> },
  { href: "/espace-parent/hub", label: "Hub de contenu", icon: <PlayCircle /> },
  { href: "/espace-parent/communaute", label: "Communauté", icon: <MessagesSquare /> },
  { href: "/espace-parent/messagerie", label: "Messagerie", icon: <MessageCircle /> },
  { href: "/espace-parent/lives", label: "Lives Q&A", icon: <Video /> },
  { href: "/espace-parent/consultations", label: "Consultations", icon: <CalendarClock /> },
  { href: "/espace-parent/journal", label: "Journal de bord", icon: <NotebookPen /> },
  { href: "/espace-parent/profil", label: "Profil de l'enfant", icon: <UserRound /> },
];

export default async function EspaceParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireProfile();
  const navItems =
    profile.role === "admin"
      ? [...PARENT_NAV, { href: "/admin", label: "Panel Admin", icon: <ShieldCheck /> }]
      : PARENT_NAV;

  return (
    <div className="flex flex-1">
      <CommunityNotifier profileId={profile.id} />
      <AppSidebar
        title="Espace parent"
        items={navItems}
        userLabel={profile.full_name}
      />
      <main className="flex-1 overflow-y-auto bg-muted/30 p-8">{children}</main>
    </div>
  );
}
