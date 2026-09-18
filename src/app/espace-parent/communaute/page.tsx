import Link from "next/link";
import { Hash, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import type { CommunityChannel } from "@/types/database.types";

export default async function CommunautePage() {
  const supabase = await createClient();
  const { data: channels } = await supabase
    .from("community_channels")
    .select("*")
    .order("name");

  const list = (channels as CommunityChannel[] | null) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Communauté</h1>
        <p className="text-muted-foreground">
          Échangez avec d&apos;autres parents, par canaux thématiques.
        </p>
      </div>

      {list.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Aucun canal pour l&apos;instant</CardTitle>
            <CardDescription>
              La spécialiste n&apos;a pas encore créé de canaux de discussion.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {list.map((channel) => (
            <Link key={channel.id} href={`/espace-parent/communaute/${channel.slug}`}>
              <Card className="h-full transition-colors hover:bg-accent">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Hash className="size-4 text-amber-400" />
                    <CardTitle>{channel.name}</CardTitle>
                    {channel.locked && (
                      <Badge variant="secondary" className="gap-1">
                        <Lock className="size-3" />
                        Verrouillé
                      </Badge>
                    )}
                  </div>
                  {channel.description && (
                    <CardDescription>{channel.description}</CardDescription>
                  )}
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
