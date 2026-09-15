import Link from "next/link";
import { notFound } from "next/navigation";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getAuthorNames } from "@/lib/get-author-names";
import type { DirectConversation, DirectMessage } from "@/types/database.types";
import { MessageThreadForm } from "../message-thread-form";

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: conversation } = await supabase
    .from("direct_conversations")
    .select("*")
    .eq("id", id)
    .single();

  if (!conversation) notFound();

  const typedConv = conversation as DirectConversation;
  const otherId =
    typedConv.parent_a_id === profile.id ? typedConv.parent_b_id : typedConv.parent_a_id;
  const names = await getAuthorNames(supabase, [otherId]);

  const { data: messages } = await supabase
    .from("direct_messages")
    .select("*")
    .eq("conversation_id", id)
    .order("created_at");

  const messageList = (messages as DirectMessage[] | null) ?? [];

  return (
    <div className="flex h-full flex-col space-y-6">
      <div>
        <Link
          href="/espace-parent/messagerie"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Toutes les conversations
        </Link>
        <h1 className="mt-1 text-2xl font-semibold">
          {names.get(otherId) ?? "Parent"}
        </h1>
      </div>

      <div className="flex-1 space-y-3 rounded-lg border border-border/60 bg-background p-4">
        {messageList.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Aucun message pour l&apos;instant — écrivez le premier.
          </p>
        )}
        {messageList.map((message) => {
          const isMine = message.sender_id === profile.id;
          return (
            <div
              key={message.id}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-sm rounded-2xl px-4 py-2 text-sm ${
                  isMine
                    ? "bg-amber-600 text-white"
                    : "bg-muted text-foreground"
                }`}
              >
                <p className="whitespace-pre-wrap">{message.body}</p>
                <p
                  className={`mt-1 text-xs ${isMine ? "text-amber-100" : "text-muted-foreground"}`}
                >
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

      <MessageThreadForm conversationId={id} />
    </div>
  );
}
