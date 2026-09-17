import type { ReactNode } from "react";
import { Pin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PreparedMessage } from "@/lib/community/prepare-messages";
import { Reactions } from "./reactions";
import { Attachment } from "./attachment";

export function ChatMessage({
  message,
  channelSlug,
  canReply = false,
  onReply,
  moderation,
}: {
  message: PreparedMessage;
  channelSlug: string;
  canReply?: boolean;
  onReply?: () => void;
  moderation?: ReactNode;
}) {
  // Comme sur WhatsApp : chacun voit ses propres messages à droite, dans une
  // couleur qui lui est propre, et ceux des autres à gauche. Les messages de
  // la spécialiste gardent en plus une couleur et une mention dédiées côté
  // parents, pour qu'on la repère au milieu d'une conversation à plusieurs.
  const side = message.isOwn ? "right" : "left";
  const tinted = message.isOwn || message.isSpecialist;

  return (
    <div className={cn("flex flex-col gap-1", side === "right" ? "items-end" : "items-start")}>
      <span
        className={cn(
          "px-1 text-xs font-medium",
          message.isSpecialist ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground",
        )}
      >
        {message.isSpecialist ? `Spécialiste · ${message.authorName}` : message.authorName}
      </span>

      <div
        className={cn(
          "relative max-w-[80%] rounded-2xl px-3.5 py-2 text-sm shadow-sm",
          message.isOwn && "rounded-br-sm bg-amber-500 text-white",
          !message.isOwn && message.isSpecialist && "rounded-bl-sm bg-emerald-600 text-white",
          !message.isOwn && !message.isSpecialist && "rounded-bl-sm bg-muted text-foreground",
        )}
      >
        {message.pinned && (
          <Pin className="absolute -top-2 -right-2 size-4 rounded-full border border-border/60 bg-background p-0.5 text-amber-600" />
        )}

        {message.replyTo && (
          <div
            className={cn(
              "mb-1.5 rounded-md border-l-2 px-2 py-1 text-xs",
              tinted ? "border-white/60 bg-white/10" : "border-amber-400 bg-black/5 dark:bg-white/10",
            )}
          >
            <p className="font-medium">{message.replyTo.authorName}</p>
            <p className="truncate opacity-80">
              {message.replyTo.body || message.replyTo.attachmentName || "Pièce jointe"}
            </p>
          </div>
        )}

        {message.attachmentUrl && message.attachmentType && (
          <div className="mb-1.5">
            <Attachment
              url={message.attachmentUrl}
              type={message.attachmentType}
              name={message.attachmentName}
              tinted={tinted}
            />
          </div>
        )}
        {message.body && <p className="whitespace-pre-wrap break-words">{message.body}</p>}
        <span className="mt-1 block text-right text-[10px] opacity-70">
          {new Date(message.createdAt).toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      <div className="flex items-center gap-2 px-1">
        <Reactions
          messageId={message.id}
          channelSlug={channelSlug}
          counts={message.reactionCounts}
          myReaction={message.myReaction}
        />
        {moderation}
        {canReply && (
          <button
            type="button"
            onClick={onReply}
            className="text-xs text-muted-foreground hover:text-foreground hover:underline"
          >
            Répondre
          </button>
        )}
      </div>
    </div>
  );
}
