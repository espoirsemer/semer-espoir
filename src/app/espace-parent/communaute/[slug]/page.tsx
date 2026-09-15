import Link from "next/link";
import { notFound } from "next/navigation";
import { Pin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getAuthorNames } from "@/lib/get-author-names";
import type { CommunityChannel, CommunityMessage } from "@/types/database.types";
import { MessageForm } from "./message-form";

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

  const canPost = profile.role === "admin" || ["tier_2", "tier_3"].includes(profile.subscription_tier ?? "");
  const typedChannel = channel as CommunityChannel;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/espace-parent/communaute"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Tous les canaux
        </Link>
        <h1 className="mt-1 text-2xl font-semibold">#{typedChannel.name}</h1>
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
        {topLevel.map((message) => (
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

              {(repliesByParent.get(message.id) ?? []).length > 0 && (
                <div className="ml-4 space-y-3 border-l border-border/60 pl-4">
                  {repliesByParent.get(message.id)!.map((reply) => (
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
                    </div>
                  ))}
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
        ))}
      </div>

      {canPost ? (
        <Card>
          <CardContent className="pt-6">
            <MessageForm channelId={typedChannel.id} channelSlug={typedChannel.slug} />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-6">
            <p className="text-sm text-muted-foreground">
              Votre formule permet de lire ce canal. Passez à Guidance ou VIP
              pour participer aux discussions.
            </p>
            <Link href="/#tarifs" className={buttonVariants({ size: "sm" })}>
              Voir les formules
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
