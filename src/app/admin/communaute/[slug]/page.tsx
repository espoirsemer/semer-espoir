import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { getAuthorNames } from "@/lib/get-author-names";
import type { CommunityChannel, CommunityMessage } from "@/types/database.types";
import { ModerationButtons } from "./moderation-buttons";

export default async function AdminChannelPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: channel } = await supabase
    .from("community_channels")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!channel) notFound();

  const { data: messages } = await supabase
    .from("community_messages")
    .select("*")
    .eq("channel_id", channel.id)
    .order("created_at", { ascending: false });

  const list = (messages as CommunityMessage[] | null) ?? [];
  const authorNames = await getAuthorNames(supabase, list.map((m) => m.author_id));
  const typedChannel = channel as CommunityChannel;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/communaute"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Tous les canaux
        </Link>
        <h1 className="mt-1 text-2xl font-semibold">#{typedChannel.name}</h1>
      </div>

      <div className="space-y-3">
        {list.length === 0 && (
          <p className="text-sm text-muted-foreground">Aucun message dans ce canal.</p>
        )}
        {list.map((message) => (
          <Card key={message.id}>
            <CardContent className="flex items-start justify-between gap-4 pt-6">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {authorNames.get(message.author_id) ?? "Un parent"}
                  </span>
                  {message.parent_message_id && (
                    <Badge variant="outline">Réponse</Badge>
                  )}
                  {message.pinned && <Badge variant="secondary">Épinglé</Badge>}
                  <span className="text-xs text-muted-foreground">
                    {new Date(message.created_at).toLocaleString("fr-FR")}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{message.body}</p>
              </div>
              <ModerationButtons
                messageId={message.id}
                pinned={message.pinned}
                slug={slug}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
