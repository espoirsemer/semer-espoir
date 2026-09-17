"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

const BAR_COUNT = 32;

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

// Extrait de vraies crêtes d'amplitude du fichier audio pour dessiner une
// forme d'onde fidèle (comme WhatsApp), avec un repli décoratif si le
// décodage échoue (format non supporté par le navigateur, etc.).
function useWaveform(url: string) {
  const [peaks, setPeaks] = useState<number[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function extract() {
      try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioContext = new AudioContext();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        const raw = audioBuffer.getChannelData(0);
        const blockSize = Math.max(1, Math.floor(raw.length / BAR_COUNT));
        const computed: number[] = [];
        for (let i = 0; i < BAR_COUNT; i++) {
          let sum = 0;
          const start = i * blockSize;
          for (let j = 0; j < blockSize; j++) {
            sum += Math.abs(raw[start + j] ?? 0);
          }
          computed.push(sum / blockSize);
        }
        const max = Math.max(...computed, 0.0001);
        audioContext.close();
        if (!cancelled) setPeaks(computed.map((v) => Math.max(0.12, v / max)));
      } catch {
        if (!cancelled) {
          setPeaks(Array.from({ length: BAR_COUNT }, () => 0.25 + Math.random() * 0.65));
        }
      }
    }

    extract();
    return () => {
      cancelled = true;
    };
  }, [url]);

  return peaks;
}

export function VoiceMessagePlayer({ url, tinted }: { url: string; tinted: boolean }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const peaks = useWaveform(url);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play();
    }
  }

  function seekTo(ratio: number) {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    audio.currentTime = Math.min(duration, Math.max(0, ratio * duration));
  }

  const progress = duration > 0 ? currentTime / duration : 0;
  const displayTime = currentTime > 0 ? currentTime : duration;

  return (
    <div className="flex items-center gap-2 py-0.5" style={{ minWidth: 220 }}>
      <audio
        ref={audioRef}
        src={url}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        className="hidden"
      />

      <button
        type="button"
        onClick={togglePlay}
        aria-label={playing ? "Mettre en pause" : "Écouter la note vocale"}
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-full",
          tinted ? "bg-white/25 text-white" : "bg-amber-500 text-white",
        )}
      >
        {playing ? <Pause className="size-4 fill-current" /> : <Play className="ml-0.5 size-4 fill-current" />}
      </button>

      <button
        type="button"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          seekTo((e.clientX - rect.left) / rect.width);
        }}
        aria-label="Avancer dans la note vocale"
        className="flex h-8 flex-1 items-center gap-[2px]"
      >
        {(peaks ?? Array.from({ length: BAR_COUNT }, () => 0.3)).map((p, i) => {
          const played = peaks ? i / BAR_COUNT < progress : false;
          return (
            <span
              key={i}
              className={cn(
                "w-[3px] shrink-0 rounded-full",
                played ? (tinted ? "bg-white" : "bg-amber-500") : tinted ? "bg-white/40" : "bg-foreground/25",
              )}
              style={{ height: `${Math.round(p * 100)}%` }}
            />
          );
        })}
      </button>

      <span className={cn("shrink-0 text-[11px] tabular-nums", tinted ? "text-white/90" : "text-muted-foreground")}>
        {formatTime(displayTime)}
      </span>
    </div>
  );
}
