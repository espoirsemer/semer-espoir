import Link from "next/link";
import { UserRound } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getAuthorNames } from "@/lib/get-author-names";
import type { DirectConversation, DirectMessage } from "@/types/database.types";
import { NewConversation } from "./new-conversation";

export default async function MessagerieePage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: conversations } = await supabase
    .from("direct_conversations")
    .select("*")
    .or(`parent_a_id.eq.${profile.id},parent_b_id.eq.${profile.id}`)
    .order("created_at", { ascending: false });

  const convList = (conversations as DirectConversation[] | null) ?? [];
  const otherIds = convList.map((c) =>
    c.parent_a_id === profile.id ? c.parent_b_id : c.parent_a_id,
  );
  const names = await getAuthorNames(supabase, otherIds);

  const lastMessages = new Map<string, DirectMessage>();
  if (convList.length > 0) {
    const { data: messages } = await supabase
      .from("direct_messages")
      .select("*")
      .in("conversation_id", convList.map((c) => c.id))
      .order("created_at", { ascending: false });

    for (const m of (messages as DirectMessage[] | null) ?? []) {
      if (!lastMessages.has(m.conversation_id)) {
        lastMessages.set(m.conversation_id, m);
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Messagerie</h1>
          <p className="text-muted-foreground">
            Échangez en privé avec d&apos;autres parents.
          </p>
        </div>
        <NewConversation />
      </div>

      {convList.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Aucune conversation pour l&apos;instant</CardTitle>
            <CardDescription>
              Démarrez une conversation avec un autre parent pour échanger en
              privé.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="divide-y divide-border/60 rounded-lg border border-border/60 bg-background">
          {convList.map((conv) => {
            const otherId =
              conv.parent_a_id === profile.id ? conv.parent_b_id : conv.parent_a_id;
            const last = lastMessages.get(conv.id);
            return (
              <Link
                key={conv.id}
                href={`/espace-parent/messagerie/${conv.id}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-accent"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <UserRound className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{names.get(otherId) ?? "Parent"}</p>
                  {last && (
                    <p className="truncate text-sm text-muted-foreground">
                      {last.sender_id === profile.id ? "Vous : " : ""}
                      {last.body}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
