"use client";

import { useEffect, useRef, useState } from "react";
import { Mic } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const startingRef = useRef(false);
  const pendingStopRef = useRef(false);

  function stop() {
    if (startingRef.current) {
      // Le micro n'a pas encore fini de démarrer : on arrêtera dès que ce sera prêt.
      pendingStopRef.current = true;
      return;
    }
    if (!mediaRecorderRef.current || mediaRecorderRef.current.state !== "recording") return;
    mediaRecorderRef.current.stop();
    setRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }

  async function start() {
    if (startingRef.current || mediaRecorderRef.current) return;
    startingRef.current = true;
    pendingStopRef.current = false;
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
        stream.getTracks().forEach((t) => t.stop());
        mediaRecorderRef.current = null;
        // Ignore les enregistrements accidentels quasi instantanés (clic rapide).
        if (blob.size > 1000) {
          const ext = mimeType.includes("ogg") ? "ogg" : mimeType.includes("mp4") ? "m4a" : "webm";
          onRecorded(new File([blob], `note-vocale-${Date.now()}.${ext}`, { type: mimeType }));
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setSeconds(0);
      setRecording(true);
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch {
      // Micro refusé ou indisponible : l'utilisateur peut toujours joindre un fichier audio existant.
    } finally {
      startingRef.current = false;
      if (pendingStopRef.current) stop();
    }
  }

  // On écoute le relâchement au niveau de la fenêtre : si le doigt/curseur
  // quitte le bouton avant d'être relâché, l'enregistrement s'arrête quand
  // même (comme sur WhatsApp), au lieu de rester bloqué en enregistrement.
  useEffect(() => {
    if (!recording) return;
    const onRelease = () => stop();
    window.addEventListener("mouseup", onRelease);
    window.addEventListener("touchend", onRelease);
    return () => {
      window.removeEventListener("mouseup", onRelease);
      window.removeEventListener("touchend", onRelease);
    };
  }, [recording]);

  return (
    <button
      type="button"
      onMouseDown={start}
      onTouchStart={(e) => {
        e.preventDefault();
        start();
      }}
      aria-label={recording ? "Relâchez pour envoyer la note vocale" : "Maintenez appuyé pour enregistrer une note vocale"}
      className={cn(
        "flex shrink-0 select-none items-center justify-center gap-1.5 rounded-full transition-colors",
        recording ? "bg-red-500 px-3 text-white" : "text-muted-foreground hover:bg-accent hover:text-foreground",
      )}
      style={{ height: size, width: recording ? undefined : size }}
    >
      <Mic className={size <= 34 ? "size-4" : "size-4.5"} />
      {recording && (
        <span className="text-xs tabular-nums">
          {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")}
        </span>
      )}
    </button>
  );
}
