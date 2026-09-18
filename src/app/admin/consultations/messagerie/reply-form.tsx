"use client";

import { useActionState, useRef, useEffect, useState } from "react";
import { SendHorizontal, X } from "lucide-react";
import { replyToParent } from "@/lib/consultations/messagerie-actions";
import { AttachmentMenu } from "@/components/chat/attachment-menu";
import { CameraCaptureDialog } from "@/components/chat/camera-capture-dialog";
import { VoiceRecorderButton } from "@/components/chat/voice-recorder-button";
import { CallButton } from "@/components/chat/call-button";

export function ReplyForm({ parentId }: { parentId: string }) {
  const [state, formAction, isPending] = useActionState(replyToParent, null);
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
    formRef.current?.requestSubmit();
  }

  function clearFile() {
    setFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleCall(body: string) {
    const fd = new FormData();
    fd.set("parent_id", parentId);
    fd.set("body", body);
    await replyToParent(null, fd);
  }

  const buttonSize = 40;

  return (
    <form
      ref={formRef}
      action={formAction}
      onReset={() => setFileName(null)}
      className="shrink-0 space-y-1.5"
    >
      <input type="hidden" name="parent_id" value={parentId} />
      <input ref={fileInputRef} type="file" name="attachment" className="hidden" />

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
          placeholder="Répondre au parent…"
          rows={1}
          className="max-h-32 flex-1 resize-none rounded-3xl border border-border/60 bg-background px-4 py-2.5 text-sm shadow-sm outline-none focus:border-amber-400"
        />
        <VoiceRecorderButton onRecorded={handleVoiceRecorded} size={buttonSize} />
        <CallButton roomId={`consult-${parentId}`} onCall={handleCall} />
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
