import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { communityMessageCutoffIso } from "@/lib/community/retention";
import type { CommunityMessage } from "@/types/database.types";

// Purge effective des messages communauté au-delà de la fenêtre de
// rétention (48h) : l'affichage les cache déjà via le filtre de date sur
// chaque page, cette route s'occupe de vraiment les supprimer (et leurs
// pièces jointes dans Storage, qui ne sont pas nettoyées automatiquement
// par une suppression en base).
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const cutoff = communityMessageCutoffIso();

  const { data: expired, error: selectError } = await admin
    .from("community_messages")
    .select("id, attachment_path")
    .lt("created_at", cutoff);

  if (selectError) {
    return NextResponse.json({ error: selectError.message }, { status: 500 });
  }

  const expiredMessages = (expired as Pick<CommunityMessage, "id" | "attachment_path">[] | null) ?? [];
  if (expiredMessages.length === 0) {
    return NextResponse.json({ deleted: 0 });
  }

  const attachmentPaths = expiredMessages
    .map((m) => m.attachment_path)
    .filter((p): p is string => !!p);

  if (attachmentPaths.length > 0) {
    await admin.storage.from("communaute").remove(attachmentPaths);
  }

  const { error: deleteError } = await admin
    .from("community_messages")
    .delete()
    .in("id", expiredMessages.map((m) => m.id));

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  return NextResponse.json({ deleted: expiredMessages.length });
}
