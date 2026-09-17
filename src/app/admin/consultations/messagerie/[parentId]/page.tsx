import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getAuthorNames } from "@/lib/get-author-names";
import type { SpecialistMessage } from "@/types/database.types";
import { SpecialistThread } from "@/components/consultations/specialist-thread";
import { ReplyForm } from "../reply-form";

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

  const { data: messages } = await supabase
    .from("specialist_messages")
    .select("*")
    .eq("parent_id", parentId)
    .order("created_at");

  const messageList = (messages as SpecialistMessage[] | null) ?? [];
  const names = await getAuthorNames(supabase, [parentId]);

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
        <SpecialistThread
          messages={messageList}
          viewerId={admin.id}
          resolveOtherName={(senderId) => names.get(senderId)}
          otherFallback="Parent"
        />
        <ReplyForm parentId={parentId} />
      </div>
    </div>
  );
}
