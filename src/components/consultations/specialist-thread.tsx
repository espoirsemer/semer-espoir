import type { SpecialistMessage } from "@/types/database.types";

export function SpecialistThread({
  messages,
  viewerId,
  resolveOtherName,
  otherFallback = "Correspondant",
}: {
  messages: SpecialistMessage[];
  viewerId: string;
  resolveOtherName: (senderId: string) => string | undefined;
  otherFallback?: string;
}) {
  return (
    <div className="min-h-0 flex-1 space-y-3 overflow-y-auto rounded-lg border border-border/60 bg-background p-4">
      {messages.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Aucun message pour l&apos;instant — écrivez le premier.
        </p>
      )}
      {messages.map((message) => {
        const isMine = message.sender_id === viewerId;
        return (
          <div key={message.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-sm rounded-2xl px-4 py-2 text-sm ${
                isMine ? "bg-amber-600 text-white" : "bg-muted text-foreground"
              }`}
            >
              {!isMine && (
                <p className="mb-0.5 text-xs font-medium text-amber-700 dark:text-amber-400">
                  {resolveOtherName(message.sender_id) ?? otherFallback}
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
  );
}
