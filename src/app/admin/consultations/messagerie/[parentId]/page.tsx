import Link from "next/link";
import { notFound } from "next/navigation";
import { Hourglass } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getAuthorNames } from "@/lib/get-author-names";
import { getSignedAttachmentUrls } from "@/lib/get-signed-attachment-urls";
import type { ConsultationBooking, ConsultationSlot, SpecialistMessage } from "@/types/database.types";
import { SpecialistThread } from "@/components/consultations/specialist-thread";
import { ReplyForm } from "../reply-form";

function formatSlot(slot: ConsultationSlot) {
  const start = new Date(slot.starts_at);
  const date = start.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
  const startTime = start.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  return `${date}, ${startTime}`;
}

export default async function AdminConversationPage({
  params,
}: {
  params: Promise<{ parentId: string }>;
}) {
  const admin = await requireAdmin();
  const { parentId } = await params;
  const supabase = await createClient();

  const { data: parentProfile } = await supabase
    .from("profiles")
    .select("id, full_name")
    .eq("id", parentId)
    .single();

  if (!parentProfile) notFound();

  const [{ data: messages }, { data: bookings }] = await Promise.all([
    supabase.from("specialist_messages").select("*").eq("parent_id", parentId).order("created_at"),
    supabase
      .from("consultation_bookings")
      .select("*, slot:consultation_slots(*)")
      .eq("parent_id", parentId)
      .eq("status", "confirmed"),
  ]);

  const messageList = (messages as SpecialistMessage[] | null) ?? [];
  const names = await getAuthorNames(supabase, [parentId]);
  const attachmentPaths = messageList.map((m) => m.attachment_path).filter((p): p is string => !!p);
  const attachmentUrls = await getSignedAttachmentUrls(attachmentPaths);

  const bookingList = (
    (bookings as (ConsultationBooking & { slot: ConsultationSlot | null })[] | null) ?? []
  ).filter((b) => b.slot);

  const now = new Date().getTime();
  const dueBooking = bookingList
    .filter((b) => new Date(b.slot!.starts_at).getTime() <= now)
    .sort((a, b) => new Date(b.slot!.starts_at).getTime() - new Date(a.slot!.starts_at).getTime())[0];
  const hasSpokenSinceDue = dueBooking
    ? messageList.some(
        (m) => m.sender_id === admin.id && new Date(m.created_at).getTime() >= new Date(dueBooking.slot!.starts_at).getTime(),
      )
    : false;
  const showReminder = !!dueBooking && !hasSpokenSinceDue;

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="shrink-0">
        <Link
          href="/admin/consultations"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Toutes les conversations
        </Link>
        <h1 className="mt-1 text-2xl font-semibold">
          {parentProfile.full_name ?? "Parent"}
        </h1>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4">
        {showReminder && (
          <div className="flex shrink-0 items-center gap-2 rounded-lg border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-300">
            <Hourglass className="size-4 shrink-0" />
            Le rendez-vous de {parentProfile.full_name ?? "ce parent"} ({formatSlot(dueBooking!.slot!)}) est
            arrivé — pensez à lancer la conversation.
          </div>
        )}
        <SpecialistThread
          messages={messageList}
          viewerId={admin.id}
          resolveOtherName={(senderId) => names.get(senderId)}
          otherFallback="Parent"
          attachmentUrls={attachmentUrls}
        />
        <ReplyForm parentId={parentId} />
      </div>
    </div>
  );
}
