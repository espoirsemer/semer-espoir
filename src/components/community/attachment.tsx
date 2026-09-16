import { FileText } from "lucide-react";
import type { CommunityAttachmentType } from "@/types/database.types";

export function Attachment({
  url,
  type,
  name,
}: {
  url: string;
  type: CommunityAttachmentType;
  name: string | null;
}) {
  if (type === "image") {
    // eslint-disable-next-line @next/next/no-img-element -- URL signée temporaire, incompatible avec l'optimiseur next/image.
    return <img src={url} alt={name ?? "Pièce jointe"} className="max-h-64 w-full rounded-lg object-cover" />;
  }

  if (type === "video") {
    return <video src={url} controls className="max-h-64 w-full rounded-lg" />;
  }

  if (type === "audio") {
    return <audio src={url} controls className="w-full max-w-[280px]" />;
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-2 rounded-lg border border-current/20 bg-black/5 px-3 py-2 text-sm hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/15"
    >
      <FileText className="size-4 shrink-0" />
      <span className="truncate underline underline-offset-2">{name ?? "Document PDF"}</span>
    </a>
  );
}
