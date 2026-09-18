import { Video, Copy } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import type { LiveSession } from "@/types/database.types";
import { LiveForm } from "./live-form";
import { DeleteLiveButton } from "./delete-live-button";

export default async function AdminLivesPage() {
  const supabase = await createClient();
  const { data: lives } = await supabase
    .from("live_sessions")
    .select("*")
    .order("starts_at");

  const liveList = (lives as LiveSession[] | null) ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Lives Q&amp;A</h1>
        <p className="text-muted-foreground">
          Programmez un appel de groupe ou un webinaire quand c&apos;est
          nécessaire — fonctionnalité pas encore incluse dans l&apos;abonnement
          actuel.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Programmer un Live</CardTitle>
        </CardHeader>
        <div className="px-6 pb-6">
          <LiveForm />
        </div>
      </Card>

      <div className="space-y-3">
        <h2 className="text-lg font-medium">Lives programmés ({liveList.length})</h2>
        {liveList.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun Live programmé pour l&apos;instant.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {liveList.map((live) => (
              <Card key={live.id}>
                <CardContent className="space-y-2 pt-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <Video className="mt-0.5 size-4 shrink-0 text-amber-400" />
                      <div>
                        <p className="text-sm font-medium">{live.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(live.starts_at).toLocaleString("fr-FR", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                    <DeleteLiveButton liveId={live.id} />
                  </div>
                  {live.description && (
                    <p className="ml-6 text-sm text-muted-foreground">{live.description}</p>
                  )}
                  <a
                    href={live.meeting_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-6 flex items-center gap-1.5 text-sm text-amber-400 underline underline-offset-4"
                  >
                    <Copy className="size-3.5" />
                    {live.meeting_url}
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
