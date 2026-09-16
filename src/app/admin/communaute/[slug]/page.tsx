import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getAuthorProfiles } from "@/lib/get-author-profiles";
import { getSignedAttachmentUrls } from "@/lib/get-signed-attachment-urls";
import type { CommunityChannel, CommunityMessage, CommunityReaction } from "@/types/database.types";
import { MessageForm } from "@/components/community/message-form";
import { ChatMessage } from "@/components/community/chat-message";
import { AutoRefresh } from "@/components/community/auto-refresh";
import { ModerationButtons } from "./moderation-buttons";
import { LockToggle } from "./lock-toggle";

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

export default async function AdminChannelPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const admin = await requireAdmin();
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
  const reactionData = buildReactionData((reactions as CommunityReaction[] | null) ?? [], admin.id);

  const attachmentPaths = list
    .map((m) => m.attachment_path)
    .filter((p): p is string => !!p);
  const attachmentUrls = await getSignedAttachmentUrls(attachmentPaths);

  const typedChannel = channel as CommunityChannel;

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

  return (
    <div className="space-y-6">
      <AutoRefresh />
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            href="/admin/communaute"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Tous les canaux
          </Link>
          <div className="mt-1 flex items-center gap-2">
            <h1 className="text-2xl font-semibold">#{typedChannel.name}</h1>
            {typedChannel.locked && <Badge variant="secondary">Verrouillé</Badge>}
          </div>
          <p className="text-sm text-muted-foreground">
            Vous pouvez toujours écrire ici, même quand le canal est verrouillé pour les parents.
          </p>
        </div>
        <LockToggle
          channelId={typedChannel.id}
          locked={typedChannel.locked}
          slug={slug}
        />
      </div>

      <div className="flex flex-col gap-5 rounded-2xl border border-border/60 bg-background/60 p-4">
        {topLevel.length === 0 && (
          <p className="text-sm text-muted-foreground">Aucun message dans ce canal.</p>
        )}
        {topLevel.map((message) => {
          const authorProfile = authorProfiles.get(message.author_id);
          const reaction = reactionData.get(message.id);
          return (
            <div key={message.id} className="flex flex-col gap-2">
              <ChatMessage
                message={message}
                isOwn={message.author_id === admin.id}
                isSpecialist={authorProfile?.role === "admin"}
                authorName={authorProfile?.fullName ?? "Un parent"}
                channelSlug={slug}
                reactionCounts={reaction?.counts ?? {}}
                myReaction={reaction?.mine ?? null}
                canReply
                moderation={
                  <ModerationButtons messageId={message.id} pinned={message.pinned} slug={slug} />
                }
                attachmentUrl={message.attachment_path ? attachmentUrls.get(message.attachment_path) : null}
              />
              {(repliesByParent.get(message.id) ?? []).map((reply) => {
                const replyAuthor = authorProfiles.get(reply.author_id);
                const replyReaction = reactionData.get(reply.id);
                return (
                  <ChatMessage
                    key={reply.id}
                    message={reply}
                    isOwn={reply.author_id === admin.id}
                    isSpecialist={replyAuthor?.role === "admin"}
                    authorName={replyAuthor?.fullName ?? "Un parent"}
                    channelSlug={slug}
                    reactionCounts={replyReaction?.counts ?? {}}
                    myReaction={replyReaction?.mine ?? null}
                    indent
                    moderation={
                      <ModerationButtons messageId={reply.id} pinned={reply.pinned} slug={slug} />
                    }
                    attachmentUrl={reply.attachment_path ? attachmentUrls.get(reply.attachment_path) : null}
                  />
                );
              })}
            </div>
          );
        })}
      </div>

      <Card>
        <CardContent className="pt-6">
          <MessageForm channelId={typedChannel.id} channelSlug={typedChannel.slug} />
        </CardContent>
      </Card>
    </div>
  );
}
