"use client";

import { useRef, type ChangeEvent } from "react";
import { Paperclip, FileText, Image as ImageIcon, Camera, Music } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export function AttachmentMenu({
  onFileSelected,
  onOpenCamera,
  size,
}: {
  onFileSelected: (file: File) => void;
  onOpenCamera: () => void;
  size: number;
}) {
  const docInputRef = useRef<HTMLInputElement>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  function handlePick(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onFileSelected(file);
    e.target.value = "";
  }

  return (
    <div>
      <input ref={docInputRef} type="file" accept="application/pdf" className="hidden" onChange={handlePick} />
      <input ref={mediaInputRef} type="file" accept="image/*,video/*" className="hidden" onChange={handlePick} />
      <input ref={audioInputRef} type="file" accept="audio/*" className="hidden" onChange={handlePick} />

      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label="Joindre"
          className="flex shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          style={{ width: size, height: size }}
        >
          <Paperclip className={size <= 34 ? "size-4" : "size-4.5"} />
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="start" className="w-52">
          <DropdownMenuItem onClick={() => docInputRef.current?.click()}>
            <FileText className="size-4" />
            Document
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => mediaInputRef.current?.click()}>
            <ImageIcon className="size-4" />
            Photos et vidéos
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onOpenCamera}>
            <Camera className="size-4" />
            Caméra
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => audioInputRef.current?.click()}>
            <Music className="size-4" />
            Audio
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
