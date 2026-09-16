import Link from "next/link";
import { notFound } from "next/navigation";
import { Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getAuthorProfiles } from "@/lib/get-author-profiles";
import { getSignedAttachmentUrls } from "@/lib/get-signed-attachment-urls";
import type { CommunityChannel, CommunityMessage, CommunityReaction } from "@/types/database.types";
import { MessageForm } from "@/components/community/message-form";
import { ChatMessage } from "@/components/community/chat-message";
import { AutoRefresh } from "@/components/community/auto-refresh";

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
  const authorProfiles = await getAuthorProfiles(list.map((m) => m.author_id));

  const { data: reactions } = list.length
    ? await supabase
        .from("community_reactions")
        .select("*")
        .in("message_id", list.map((m) => m.id))
    : { data: [] as CommunityReaction[] };
  const reactionData = buildReactionData((reactions as CommunityReaction[] | null) ?? [], profile.id);

  const attachmentPaths = list
    .map((m) => m.attachment_path)
    .filter((p): p is string => !!p);
  const attachmentUrls = await getSignedAttachmentUrls(attachmentPaths);

  const topLevel = list
    .filter((m) => !m.parent_message_id)
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
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
      <AutoRefresh />
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

      <div className="flex flex-col gap-5 rounded-2xl border border-border/60 bg-background/60 p-4">
        {topLevel.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Aucun message pour l&apos;instant — soyez le premier à écrire.
          </p>
        )}
        {topLevel.map((message) => {
          const authorProfile = authorProfiles.get(message.author_id);
          const reaction = reactionData.get(message.id);
          const isOwn = message.author_id === profile.id;
          const isSpecialist = authorProfile?.role === "admin";
          return (
            <div key={message.id} className="flex flex-col gap-2">
              <ChatMessage
                message={message}
                isOwn={isOwn}
                isSpecialist={isSpecialist}
                authorName={authorProfile?.fullName ?? "Un membre"}
                channelSlug={slug}
                reactionCounts={reaction?.counts ?? {}}
                myReaction={reaction?.mine ?? null}
                canReply={canPost}
                attachmentUrl={message.attachment_path ? attachmentUrls.get(message.attachment_path) : null}
              />
              {(repliesByParent.get(message.id) ?? []).map((reply) => {
                const replyAuthor = authorProfiles.get(reply.author_id);
                const replyReaction = reactionData.get(reply.id);
                return (
                  <ChatMessage
                    key={reply.id}
                    message={reply}
                    isOwn={reply.author_id === profile.id}
                    isSpecialist={replyAuthor?.role === "admin"}
                    authorName={replyAuthor?.fullName ?? "Un membre"}
                    channelSlug={slug}
                    reactionCounts={replyReaction?.counts ?? {}}
                    myReaction={replyReaction?.mine ?? null}
                    indent
                    attachmentUrl={reply.attachment_path ? attachmentUrls.get(reply.attachment_path) : null}
                  />
                );
              })}
            </div>
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
            La spécialiste a verrouillé ce canal : seuls les administrateurs
            peuvent écrire pour l&apos;instant.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
