import Link from "next/link";
import { Video } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { LiveSession } from "@/types/database.types";

export default async function LivesPage() {
  const profile = await requireProfile();
  const canAccess = profile.role === "admin" || ["tier_2", "tier_3"].includes(profile.subscription_tier ?? "");

  if (!canAccess) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Lives Q&amp;A</h1>
          <p className="text-muted-foreground">
            Appels de groupe et webinaires avec la spécialiste.
          </p>
        </div>
        <Card>
          <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-6">
            <p className="text-sm text-muted-foreground">
              L&apos;accès aux Lives Q&amp;A n&apos;est pas encore inclus dans
              l&apos;abonnement actuel — de nouveaux avantages seront ajoutés
              progressivement.
            </p>
            <Link href="/#tarifs" className={buttonVariants({ size: "sm" })}>
              Voir l&apos;abonnement
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const supabase = await createClient();
  const { data: lives } = await supabase
    .from("live_sessions")
    .select("*")
    .order("starts_at");

  const liveList = (lives as LiveSession[] | null) ?? [];
  const cutoff = new Date();
  cutoff.setHours(cutoff.getHours() - 1);
  const upcoming = liveList.filter((l) => new Date(l.starts_at) >= cutoff);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Lives Q&amp;A</h1>
        <p className="text-muted-foreground">
          Appels de groupe et webinaires avec la spécialiste.
        </p>
      </div>

      {upcoming.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">
            Aucun Live programmé pour l&apos;instant — revenez bientôt.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {upcoming.map((live) => (
            <Card key={live.id}>
              <CardContent className="space-y-3 pt-6">
                <div className="flex items-start gap-2.5">
                  <Video className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
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
                {live.description && (
                  <p className="text-sm text-muted-foreground">{live.description}</p>
                )}
                <a
                  href={live.meeting_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({ size: "sm" })}
                >
                  Rejoindre le Live
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
