"use client";

import { useState, type ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChatMessage } from "./chat-message";
import { MessageForm } from "./message-form";
import { ModerationButtons } from "./moderation-buttons";
import type { PreparedMessage } from "@/lib/community/prepare-messages";

export type ReplyTarget = { id: string; authorName: string; snippet: string };

export function ChatThread({
  messages,
  channelId,
  channelSlug,
  canPost,
  lockedNotice,
  showModeration = false,
}: {
  messages: PreparedMessage[];
  channelId: string;
  channelSlug: string;
  canPost: boolean;
  lockedNotice?: ReactNode;
  showModeration?: boolean;
}) {
  const [replyingTo, setReplyingTo] = useState<ReplyTarget | null>(null);

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="min-h-0 flex-1 overflow-y-auto rounded-2xl border border-border/60 bg-background/60 p-4">
        <div className="flex flex-col gap-5">
          {messages.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Aucun message pour l&apos;instant — soyez le premier à écrire.
            </p>
          )}
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              channelSlug={channelSlug}
              canReply={canPost}
              onReply={() =>
                setReplyingTo({
                  id: message.id,
                  authorName: message.authorName,
                  snippet: message.body || message.attachmentName || "Pièce jointe",
                })
              }
              moderation={
                showModeration && (
                  <ModerationButtons messageId={message.id} pinned={message.pinned} slug={channelSlug} />
                )
              }
            />
          ))}
        </div>
      </div>

      {/* Volontairement hors de la zone défilante ci-dessus : le composeur
          reste ainsi toujours le dernier élément visible de la page, sans
          jamais être recouvert par un message ni recouvrir lui-même un
          message, quelle que soit la hauteur qu'il prend. */}
      <div className="shrink-0">
        <Card>
          <CardContent className={canPost ? "pt-6" : "flex items-center gap-2 pt-6 text-sm text-muted-foreground"}>
            {canPost ? (
              <MessageForm
                channelId={channelId}
                channelSlug={channelSlug}
                replyingTo={replyingTo}
                onCancelReply={() => setReplyingTo(null)}
              />
            ) : (
              lockedNotice
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
