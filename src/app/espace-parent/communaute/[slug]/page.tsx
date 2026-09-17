import Link from "next/link";
import { notFound } from "next/navigation";
import { Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getAuthorProfiles } from "@/lib/get-author-profiles";
import { getSignedAttachmentUrls } from "@/lib/get-signed-attachment-urls";
import { prepareMessages } from "@/lib/community/prepare-messages";
import { communityMessageCutoffIso, COMMUNITY_MESSAGE_RETENTION_HOURS } from "@/lib/community/retention";
import type { CommunityChannel, CommunityMessage, CommunityReaction } from "@/types/database.types";
import { ChatThread } from "@/components/community/chat-thread";
import { AutoRefresh } from "@/components/community/auto-refresh";

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
    .gte("created_at", communityMessageCutoffIso())
    .order("created_at");

  const list = (messages as CommunityMessage[] | null) ?? [];
  const authorProfiles = await getAuthorProfiles(list.map((m) => m.author_id));

  const { data: reactions } = list.length
    ? await supabase
        .from("community_reactions")
        .select("*")
        .in("message_id", list.map((m) => m.id))
    : { data: [] as CommunityReaction[] };

  const attachmentPaths = list
    .map((m) => m.attachment_path)
    .filter((p): p is string => !!p);
  const attachmentUrls = await getSignedAttachmentUrls(attachmentPaths);

  const preparedMessages = prepareMessages({
    messages: list,
    authorProfiles,
    reactions: (reactions as CommunityReaction[] | null) ?? [],
    attachmentUrls,
    viewerId: profile.id,
  });

  const typedChannel = channel as CommunityChannel;
  const canPost = profile.role === "admin" || !typedChannel.locked;

  return (
    <div className="flex h-full flex-col gap-6">
      <AutoRefresh />
      <div className="shrink-0">
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
        <p className="text-xs text-muted-foreground">
          Les messages sont automatiquement supprimés {COMMUNITY_MESSAGE_RETENTION_HOURS}h après leur envoi.
        </p>
      </div>

      <div className="min-h-0 flex-1">
        <ChatThread
          messages={preparedMessages}
          channelId={typedChannel.id}
          channelSlug={slug}
          canPost={canPost}
          lockedNotice={
            <>
              <Lock className="size-4" />
              La spécialiste a verrouillé ce canal : seuls les administrateurs
              peuvent écrire pour l&apos;instant.
            </>
          }
        />
      </div>
    </div>
  );
}
