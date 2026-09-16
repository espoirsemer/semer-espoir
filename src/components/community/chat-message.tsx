import type { ReactNode } from "react";
import { Pin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CommunityMessage } from "@/types/database.types";
import { ReplyToggle } from "./reply-toggle";
import { Reactions } from "./reactions";

export function ChatMessage({
  message,
  isOwn,
  isSpecialist,
  authorName,
  channelSlug,
  reactionCounts,
  myReaction,
  canReply = false,
  moderation,
  indent = false,
}: {
  message: CommunityMessage;
  isOwn: boolean;
  isSpecialist: boolean;
  authorName: string;
  channelSlug: string;
  reactionCounts: Record<string, number>;
  myReaction: string | null;
  canReply?: boolean;
  moderation?: ReactNode;
  indent?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1",
        isOwn ? "items-end" : "items-start",
        indent && "ml-6",
      )}
    >
      {!isOwn && (
        <span
          className={cn(
            "px-1 text-xs font-medium",
            isSpecialist ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground",
          )}
        >
          {authorName}
          {isSpecialist && " · Spécialiste"}
        </span>
      )}

      <div
        className={cn(
          "relative max-w-[80%] rounded-2xl px-3.5 py-2 text-sm shadow-sm",
          isOwn && "rounded-br-sm bg-amber-500 text-white",
          !isOwn && isSpecialist && "rounded-bl-sm bg-emerald-600 text-white",
          !isOwn && !isSpecialist && "rounded-bl-sm bg-muted text-foreground",
        )}
      >
        {message.pinned && (
          <Pin className="absolute -top-2 -right-2 size-4 rounded-full border border-border/60 bg-background p-0.5 text-amber-600" />
        )}
        <p className="whitespace-pre-wrap break-words">{message.body}</p>
        <span className="mt-1 block text-right text-[10px] opacity-70">
          {new Date(message.created_at).toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      <div className="flex items-center gap-2 px-1">
        <Reactions
          messageId={message.id}
          channelSlug={channelSlug}
          counts={reactionCounts}
          myReaction={myReaction}
        />
        {moderation}
      </div>

      {canReply && (
        <ReplyToggle
          channelId={message.channel_id}
          channelSlug={channelSlug}
          parentMessageId={message.id}
        />
      )}
    </div>
  );
}
