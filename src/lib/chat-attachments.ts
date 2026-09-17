import { createAdminClient } from "@/lib/supabase/server";
import type { CommunityAttachmentType } from "@/types/database.types";

export const MAX_ATTACHMENT_BYTES = 25 * 1024 * 1024;

export function attachmentTypeFor(mimeType: string): CommunityAttachmentType | null {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("audio/")) return "audio";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType === "application/pdf") return "pdf";
  return null;
}

export type UploadedAttachment = {
  attachmentPath: string;
  attachmentType: CommunityAttachmentType;
  attachmentName: string;
};

// Bucket "communaute" partagé entre la communauté et la messagerie avec la
// spécialiste (préfixes de chemin distincts pour rester organisés) : pas
// besoin d'un second bucket ni de nouvelles politiques Storage.
export async function uploadChatAttachment(
  file: File,
  pathPrefix: string,
): Promise<UploadedAttachment | { error: string }> {
  if (file.size > MAX_ATTACHMENT_BYTES) {
    return { error: "Le fichier dépasse la taille maximale (25 Mo)." };
  }
  const type = attachmentTypeFor(file.type);
  if (!type) {
    return { error: "Format de fichier non pris en charge (photo, PDF, audio ou vidéo uniquement)." };
  }

  const admin = createAdminClient();
  const ext = file.name.includes(".") ? file.name.split(".").pop() : null;
  const path = `${pathPrefix}/${crypto.randomUUID()}${ext ? `.${ext}` : ""}`;
  const { error: uploadError } = await admin.storage
    .from("communaute")
    .upload(path, file, { contentType: file.type });

  if (uploadError) {
    return { error: `Échec de l'envoi du fichier : ${uploadError.message}` };
  }

  return { attachmentPath: path, attachmentType: type, attachmentName: file.name };
}
