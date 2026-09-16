import Link from "next/link";
import { notFound } from "next/navigation";
import { Pin, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getAuthorNames } from "@/lib/get-author-names";
import type { CommunityChannel, CommunityMessage, CommunityReaction } from "@/types/database.types";
import { MessageForm } from "./message-form";
import { Reactions } from "./reactions";

function buildReactionData(reactions: CommunityReaction[], profileId: string) {
  const byMessage = new Map<string, { counts: Record<string, number>; mine: string | null }>();
  for (const r of reactions) {
    const entry = byMessage.get(r.message_id) ?? { counts: {}, mine: null };
    entry.counts[r.emoji] = (entry.counts[r.emoji] ?? 0) + 1;
    if (r.profile_id === profileId) entry.mine = r.emoji;
    byMessage.set(r.message_id, entry);
  }
  return byMessage;
}

export default async function ChannelPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const profile = await requireProfile();
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
    .order("created_at");

  const list = (messages as CommunityMessage[] | null) ?? [];
  const authorNames = await getAuthorNames(supabase, list.map((m) => m.author_id));

  const { data: reactions } = list.length
    ? await supabase
        .from("community_reactions")
        .select("*")
        .in("message_id", list.map((m) => m.id))
    : { data: [] as CommunityReaction[] };
  const reactionData = buildReactionData((reactions as CommunityReaction[] | null) ?? [], profile.id);

  const topLevel = list
    .filter((m) => !m.parent_message_id)
    .sort((a, b) => Number(b.pinned) - Number(a.pinned));
  const repliesByParent = new Map<string, CommunityMessage[]>();
  for (const m of list) {
    if (m.parent_message_id) {
      const arr = repliesByParent.get(m.parent_message_id) ?? [];
      arr.push(m);
      repliesByParent.set(m.parent_message_id, arr);
    }
  }

  const typedChannel = channel as CommunityChannel;
  const canPost = profile.role === "admin" || !typedChannel.locked;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/espace-parent/communaute"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Tous les canaux
        </Link>
        <div className="mt-1 flex items-center gap-2">
          <h1 className="text-2xl font-semibold">#{typedChannel.name}</h1>
          {typedChannel.locked && (
            <Badge variant="secondary" className="gap-1">
              <Lock className="size-3" />
              Verrouillé
            </Badge>
          )}
        </div>
        {typedChannel.description && (
          <p className="text-muted-foreground">{typedChannel.description}</p>
        )}
      </div>

      <div className="space-y-4">
        {topLevel.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Aucun message pour l&apos;instant — soyez le premier à écrire.
          </p>
        )}
        {topLevel.map((message) => {
          const myReaction = reactionData.get(message.id);
          return (
            <Card key={message.id}>
              <CardContent className="space-y-3 pt-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {authorNames.get(message.author_id) ?? "Un parent"}
                  </span>
                  {message.pinned && (
                    <Badge variant="secondary" className="gap-1">
                      <Pin className="size-3" />
                      Épinglé
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {new Date(message.created_at).toLocaleDateString("fr-FR")}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{message.body}</p>

                <Reactions
                  messageId={message.id}
                  channelSlug={slug}
                  counts={myReaction?.counts ?? {}}
                  myReaction={myReaction?.mine ?? null}
                />

                {(repliesByParent.get(message.id) ?? []).length > 0 && (
                  <div className="ml-4 space-y-3 border-l border-border/60 pl-4">
                    {repliesByParent.get(message.id)!.map((reply) => {
                      const replyReaction = reactionData.get(reply.id);
                      return (
                        <div key={reply.id} className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              {authorNames.get(reply.author_id) ?? "Un parent"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(reply.created_at).toLocaleDateString("fr-FR")}
                            </span>
                          </div>
                          <p className="text-sm whitespace-pre-wrap">{reply.body}</p>
                          <Reactions
                            messageId={reply.id}
                            channelSlug={slug}
                            counts={replyReaction?.counts ?? {}}
                            myReaction={replyReaction?.mine ?? null}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}

                {canPost && (
                  <MessageForm
                    channelId={typedChannel.id}
                    channelSlug={typedChannel.slug}
                    parentMessageId={message.id}
                    placeholder="Répondre..."
                    compact
                  />
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {canPost ? (
        <Card>
          <CardContent className="pt-6">
            <MessageForm channelId={typedChannel.id} channelSlug={typedChannel.slug} />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex items-center gap-2 pt-6 text-sm text-muted-foreground">
            <Lock className="size-4" />
            La spécialiste a temporairement limité l&apos;envoi de messages
            dans ce canal.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
