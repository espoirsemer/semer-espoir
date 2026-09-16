"use client";

import { useActionState, useRef, useEffect, useState } from "react";
import { SendHorizontal, X } from "lucide-react";
import { postMessage } from "@/lib/community/actions";
import { AttachmentMenu } from "./attachment-menu";
import { CameraCaptureDialog } from "./camera-capture-dialog";
import { VoiceRecorderButton } from "./voice-recorder-button";
import type { ReplyTarget } from "./chat-thread";

export function MessageForm({
  channelId,
  channelSlug,
  replyingTo,
  onCancelReply,
  placeholder = "Écrivez un message…",
}: {
  channelId: string;
  channelSlug: string;
  replyingTo?: ReplyTarget | null;
  onCancelReply?: () => void;
  placeholder?: string;
}) {
  const [state, formAction, isPending] = useActionState(postMessage, null);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);

  useEffect(() => {
    if (state === "success") {
      formRef.current?.reset();
    }
  }, [state]);

  function setAttachedFile(file: File) {
    const transfer = new DataTransfer();
    transfer.items.add(file);
    if (fileInputRef.current) fileInputRef.current.files = transfer.files;
    setFileName(file.name);
  }

  function handleVoiceRecorded(file: File) {
    setAttachedFile(file);
    // Comme sur WhatsApp : relâcher le micro envoie directement la note vocale.
    formRef.current?.requestSubmit();
  }

  function clearFile() {
    setFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const buttonSize = 40;

  return (
    <form
      ref={formRef}
      action={formAction}
      onReset={() => {
        setFileName(null);
        onCancelReply?.();
      }}
      className="space-y-1.5"
    >
      <input type="hidden" name="channel_id" value={channelId} />
      <input type="hidden" name="channel_slug" value={channelSlug} />
      {replyingTo && <input type="hidden" name="parent_message_id" value={replyingTo.id} />}
      <input ref={fileInputRef} type="file" name="attachment" className="hidden" />

      {replyingTo && (
        <div className="flex items-center justify-between gap-2 rounded-lg border-l-4 border-amber-400 bg-muted px-3 py-1.5 text-xs">
          <div className="min-w-0">
            <p className="font-medium">{replyingTo.authorName}</p>
            <p className="truncate text-muted-foreground">{replyingTo.snippet}</p>
          </div>
          <button
            type="button"
            onClick={onCancelReply}
            aria-label="Annuler la réponse"
            className="shrink-0 text-muted-foreground hover:text-foreground"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      {fileName && (
        <div className="flex w-fit items-center gap-2 rounded-full border border-border/60 bg-muted px-3 py-1 text-xs">
          <span className="max-w-[200px] truncate">{fileName}</span>
          <button
            type="button"
            onClick={clearFile}
            aria-label="Retirer la pièce jointe"
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="size-3" />
          </button>
        </div>
      )}

      <div className="flex items-end gap-2">
        <AttachmentMenu
          onFileSelected={setAttachedFile}
          onOpenCamera={() => setCameraOpen(true)}
          size={buttonSize}
        />
        <textarea
          name="body"
          placeholder={placeholder}
          rows={1}
          className="max-h-32 flex-1 resize-none rounded-3xl border border-border/60 bg-background px-4 py-2.5 text-sm shadow-sm outline-none focus:border-amber-400"
        />
        <VoiceRecorderButton onRecorded={handleVoiceRecorded} size={buttonSize} />
        <button
          type="submit"
          disabled={isPending}
          aria-label="Envoyer"
          className="flex shrink-0 items-center justify-center rounded-full bg-amber-500 text-white transition-colors hover:bg-amber-600 disabled:opacity-60"
          style={{ width: buttonSize, height: buttonSize }}
        >
          <SendHorizontal className="size-4.5" />
        </button>
      </div>
      {state && state !== "success" && (
        <p className="px-2 text-xs text-destructive">{state}</p>
      )}

      {cameraOpen && (
        <CameraCaptureDialog
          onCapture={(file) => {
            setAttachedFile(file);
            setCameraOpen(false);
          }}
          onClose={() => setCameraOpen(false)}
        />
      )}
    </form>
  );
}
