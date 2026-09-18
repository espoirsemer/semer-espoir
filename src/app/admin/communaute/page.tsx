import Link from "next/link";
import { Hash, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import type { CommunityChannel } from "@/types/database.types";
import { ChannelForm } from "./channel-form";
import { DeleteChannelButton } from "./delete-channel-button";

export default async function AdminCommunautePage() {
  const supabase = await createClient();
  const { data: channels } = await supabase
    .from("community_channels")
    .select("*")
    .order("name");

  const list = (channels as CommunityChannel[] | null) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Modération de la communauté</h1>
        <p className="text-muted-foreground">
          Créez des canaux, épinglez ou supprimez des messages.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Créer un canal</CardTitle>
        </CardHeader>
        <div className="px-6 pb-6">
          <ChannelForm />
        </div>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        {list.map((channel) => (
          <Card key={channel.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <Link
                  href={`/admin/communaute/${channel.slug}`}
                  className="flex items-center gap-2 hover:underline"
                >
                  <Hash className="size-4 text-amber-400" />
                  <CardTitle>{channel.name}</CardTitle>
                  {channel.locked && (
                    <Badge variant="secondary" className="gap-1">
                      <Lock className="size-3" />
                      Verrouillé
                    </Badge>
                  )}
                </Link>
                <DeleteChannelButton channelId={channel.id} />
              </div>
              {channel.description && (
                <CardDescription>{channel.description}</CardDescription>
              )}
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
