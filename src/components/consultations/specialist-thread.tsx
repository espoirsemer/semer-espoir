import type { SpecialistMessage } from "@/types/database.types";
import { Attachment } from "@/components/chat/attachment";
import { linkify } from "@/lib/linkify";

export function SpecialistThread({
  messages,
  viewerId,
  resolveOtherName,
  otherFallback = "Correspondant",
  attachmentUrls,
}: {
  messages: SpecialistMessage[];
  viewerId: string;
  resolveOtherName: (senderId: string) => string | undefined;
  otherFallback?: string;
  attachmentUrls: Map<string, string>;
}) {
  return (
    <div className="min-h-0 flex-1 space-y-4 overflow-y-auto rounded-lg border border-border/60 bg-background p-4">
      {messages.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Aucun message pour l&apos;instant — écrivez le premier.
        </p>
      )}
      {messages.map((message) => {
        const isMine = message.sender_id === viewerId;
        const attachmentUrl = message.attachment_path ? attachmentUrls.get(message.attachment_path) : null;

        return (
          <div key={message.id} className={`flex flex-col gap-1 ${isMine ? "items-end" : "items-start"}`}>
            <span className="px-1 text-xs font-medium text-muted-foreground">
              {isMine ? "Vous" : (resolveOtherName(message.sender_id) ?? otherFallback)}
            </span>
            <div
              className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm shadow-sm ${
                isMine ? "rounded-br-sm bg-amber-500 text-white" : "rounded-bl-sm bg-muted text-foreground"
              }`}
            >
              {attachmentUrl && message.attachment_type && (
                <div className="mb-1.5">
                  <Attachment
                    url={attachmentUrl}
                    type={message.attachment_type}
                    name={message.attachment_name}
                    tinted={isMine}
                  />
                </div>
              )}
              {message.body && (
                <p className="whitespace-pre-wrap break-words">{linkify(message.body)}</p>
              )}
              <span className="mt-1 block text-right text-[10px] opacity-70">
                {new Date(message.created_at).toLocaleTimeString("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
