import type { CommunityMessage, CommunityReaction, CommunityAttachmentType } from "@/types/database.types";
import type { AuthorProfile } from "@/lib/get-author-profiles";

export type PreparedMessage = {
  id: string;
  channelId: string;
  body: string;
  pinned: boolean;
  createdAt: string;
  authorName: string;
  isOwn: boolean;
  isSpecialist: boolean;
  reactionCounts: Record<string, number>;
  myReaction: string | null;
  attachmentUrl: string | null;
  attachmentType: CommunityAttachmentType | null;
  attachmentName: string | null;
  replyTo: { authorName: string; body: string; attachmentName: string | null } | null;
};

export function prepareMessages({
  messages,
  authorProfiles,
  reactions,
  attachmentUrls,
  viewerId,
}: {
  messages: CommunityMessage[];
  authorProfiles: Map<string, AuthorProfile>;
  reactions: CommunityReaction[];
  attachmentUrls: Map<string, string>;
  viewerId: string;
}): PreparedMessage[] {
  const reactionData = new Map<string, { counts: Record<string, number>; mine: string | null }>();
  for (const r of reactions) {
    const entry = reactionData.get(r.message_id) ?? { counts: {}, mine: null };
    entry.counts[r.emoji] = (entry.counts[r.emoji] ?? 0) + 1;
    if (r.profile_id === viewerId) entry.mine = r.emoji;
    reactionData.set(r.message_id, entry);
  }

  const byId = new Map(messages.map((m) => [m.id, m]));

  const sorted = [...messages].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );

  return sorted.map((m) => {
    const author = authorProfiles.get(m.author_id);
    const reaction = reactionData.get(m.id);
    const parent = m.parent_message_id ? byId.get(m.parent_message_id) : null;
    const parentAuthor = parent ? authorProfiles.get(parent.author_id) : null;

    return {
      id: m.id,
      channelId: m.channel_id,
      body: m.body,
      pinned: m.pinned,
      createdAt: m.created_at,
      authorName: author?.fullName ?? "Un membre",
      isOwn: m.author_id === viewerId,
      isSpecialist: author?.role === "admin",
      reactionCounts: reaction?.counts ?? {},
      myReaction: reaction?.mine ?? null,
      attachmentUrl: m.attachment_path ? (attachmentUrls.get(m.attachment_path) ?? null) : null,
      attachmentType: m.attachment_type,
      attachmentName: m.attachment_name,
      replyTo: parent
        ? {
            authorName: parentAuthor?.fullName ?? "Un membre",
            body: parent.body,
            attachmentName: parent.attachment_name,
          }
        : null,
    };
  });
}
