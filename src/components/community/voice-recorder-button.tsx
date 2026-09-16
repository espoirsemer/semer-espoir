"use client";

import { useRef, useState } from "react";
import { Mic, Square } from "lucide-react";

export function VoiceRecorderButton({
  onRecorded,
  size,
}: {
  onRecorded: (file: File) => void;
  size: number;
}) {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function start() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const mimeType = (recorder.mimeType || "audio/webm").split(";")[0];
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const ext = mimeType.includes("ogg") ? "ogg" : mimeType.includes("mp4") ? "m4a" : "webm";
        onRecorded(new File([blob], `note-vocale-${Date.now()}.${ext}`, { type: mimeType }));
        stream.getTracks().forEach((t) => t.stop());
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setSeconds(0);
      setRecording(true);
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch {
      // Micro refusé ou indisponible : l'utilisateur peut toujours joindre un fichier audio existant.
    }
  }

  function stop() {
    mediaRecorderRef.current?.stop();
    setRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }

  if (recording) {
    return (
      <button
        type="button"
        onClick={stop}
        aria-label="Arrêter l'enregistrement"
        className="flex shrink-0 items-center gap-1.5 rounded-full bg-red-500 px-3 text-white"
        style={{ height: size }}
      >
        <Square className="size-3 fill-current" />
        <span className="text-xs tabular-nums">
          {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={start}
      aria-label="Enregistrer une note vocale"
      className="flex shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      style={{ width: size, height: size }}
    >
      <Mic className={size <= 34 ? "size-4" : "size-4.5"} />
    </button>
  );
}
