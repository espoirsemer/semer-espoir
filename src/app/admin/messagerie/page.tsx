import Link from "next/link";
import { UserRound } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { getAuthorNames } from "@/lib/get-author-names";
import type { SpecialistMessage } from "@/types/database.types";

export default async function AdminMessageriePage() {
  const supabase = await createClient();

  const [{ data: messages }, { data: bookings }] = await Promise.all([
    supabase.from("specialist_messages").select("*").order("created_at", { ascending: false }),
    supabase.from("consultation_bookings").select("parent_id"),
  ]);

  const messageList = (messages as SpecialistMessage[] | null) ?? [];
  const lastMessageByParent = new Map<string, SpecialistMessage>();
  for (const m of messageList) {
    if (!lastMessageByParent.has(m.parent_id)) {
      lastMessageByParent.set(m.parent_id, m);
    }
  }

  const bookedParentIds = new Set(
    ((bookings as { parent_id: string }[] | null) ?? []).map((b) => b.parent_id),
  );
  // Parents éligibles (rendez-vous pris) sans thread encore ouvert.
  const withoutThread = [...bookedParentIds].filter((id) => !lastMessageByParent.has(id));

  const allIds = [...lastMessageByParent.keys(), ...withoutThread];
  const names = await getAuthorNames(supabase, allIds);

  const threads = [...lastMessageByParent.entries()].sort(
    (a, b) => new Date(b[1].created_at).getTime() - new Date(a[1].created_at).getTime(),
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Messagerie</h1>
        <p className="text-muted-foreground">
          Échangez avec les parents ayant réservé une consultation.
        </p>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-medium">Conversations</h2>
        {threads.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun message pour l&apos;instant.</p>
        ) : (
          <div className="divide-y divide-border/60 rounded-lg border border-border/60 bg-background">
            {threads.map(([parentId, last]) => (
              <Link
                key={parentId}
                href={`/admin/messagerie/${parentId}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-accent"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <UserRound className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{names.get(parentId) ?? "Parent"}</p>
                  <p className="truncate text-sm text-muted-foreground">{last.body}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {withoutThread.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-medium">
            Parents avec rendez-vous, sans conversation
          </h2>
          <div className="flex flex-wrap gap-2">
            {withoutThread.map((parentId) => (
              <Link key={parentId} href={`/admin/messagerie/${parentId}`}>
                <Card className="transition-colors hover:bg-accent">
                  <CardContent className="flex items-center gap-2 px-4 py-2.5">
                    <UserRound className="size-4 text-muted-foreground" />
                    <span className="text-sm">{names.get(parentId) ?? "Parent"}</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
