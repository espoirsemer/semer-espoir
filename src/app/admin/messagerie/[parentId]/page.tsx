import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAuthorNames } from "@/lib/get-author-names";
import type { SpecialistMessage } from "@/types/database.types";
import { ReplyForm } from "../reply-form";

export default async function AdminConversationPage({
  params,
}: {
  params: Promise<{ parentId: string }>;
}) {
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
  const adminIds = [...new Set(messageList.filter((m) => m.sender_id !== parentId).map((m) => m.sender_id))];
  const names = await getAuthorNames(supabase, adminIds);

  return (
    <div className="flex h-full flex-col space-y-6">
      <div>
        <Link
          href="/admin/messagerie"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Toutes les conversations
        </Link>
        <h1 className="mt-1 text-2xl font-semibold">
          {parentProfile.full_name ?? "Parent"}
        </h1>
      </div>

      <div className="flex-1 space-y-3 rounded-lg border border-border/60 bg-background p-4">
        {messageList.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Aucun message pour l&apos;instant — écrivez le premier.
          </p>
        )}
        {messageList.map((message) => {
          const isMine = message.sender_id !== parentId;
          return (
            <div key={message.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-sm rounded-2xl px-4 py-2 text-sm ${
                  isMine ? "bg-amber-600 text-white" : "bg-muted text-foreground"
                }`}
              >
                {isMine && (
                  <p className="mb-0.5 text-xs font-medium text-amber-100">
                    {names.get(message.sender_id) ?? "Vous"}
                  </p>
                )}
                <p className="whitespace-pre-wrap">{message.body}</p>
                <p className={`mt-1 text-xs ${isMine ? "text-amber-100" : "text-muted-foreground"}`}>
                  {new Date(message.created_at).toLocaleString("fr-FR", {
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <ReplyForm parentId={parentId} />
    </div>
  );
}
