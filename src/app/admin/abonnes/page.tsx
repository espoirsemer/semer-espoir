import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/database.types";
import { RoleToggleButton } from "./role-toggle-button";

const TIER_LABELS: Record<string, string> = {
  tier_1: "Abonnement",
  tier_2: "Guidance",
  tier_3: "VIP",
};

export default async function AdminAbonnesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const supabase = await createClient();

  const { data: admins } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "admin")
    .order("created_at", { ascending: false });
  const adminList = (admins as Profile[] | null) ?? [];

  let query = supabase
    .from("profiles")
    .select("*")
    .eq("role", "parent")
    .order("created_at", { ascending: false });

  if (q) {
    query = query.ilike("full_name", `%${q}%`);
  }

  const { data: profiles } = await query;
  const list = (profiles as Profile[] | null) ?? [];
  const now = new Date();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Abonnés</h1>
        <p className="text-muted-foreground">
          Rechercher un parent, consulter son dashboard enfant (Tier VIP).
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Administrateurs</CardTitle>
          <CardDescription>
            Ces comptes ont accès à l&apos;ensemble du panel admin. Nommez un
            parent administrateur depuis sa fiche.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {adminList.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun administrateur.</p>
          ) : (
            <div className="divide-y divide-border/60 rounded-lg border border-border/60">
              {adminList.map((admin) => (
                <div
                  key={admin.id}
                  className="flex items-center justify-between gap-3 px-4 py-3"
                >
                  <Link
                    href={`/admin/abonnes/${admin.id}`}
                    className="font-medium hover:underline"
                  >
                    {admin.full_name ?? "Sans nom"}
                  </Link>
                  <RoleToggleButton profileId={admin.id} role="admin" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <form className="flex max-w-sm gap-2">
        <Input
          name="q"
          placeholder="Rechercher un parent par nom…"
          defaultValue={q}
        />
        <Button type="submit" variant="outline">
          Rechercher
        </Button>
      </form>

      {list.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">
            Aucun parent trouvé.
          </CardContent>
        </Card>
      ) : (
        <div className="divide-y divide-border/60 rounded-lg border border-border/60">
          {list.map((profile) => (
            <Link
              key={profile.id}
              href={`/admin/abonnes/${profile.id}`}
              className="flex items-center justify-between px-4 py-3 hover:bg-accent"
            >
              <div>
                <p className="font-medium">{profile.full_name ?? "Sans nom"}</p>
                <p className="text-xs text-muted-foreground">
                  Inscrit le {new Date(profile.created_at).toLocaleDateString("fr-FR")}
                </p>
              </div>
              {profile.subscription_tier ? (
                <div className="flex flex-col items-end gap-1">
                  <Badge variant="secondary">{TIER_LABELS[profile.subscription_tier]}</Badge>
                  {profile.subscription_expires_at && (
                    <span className="text-xs text-muted-foreground">
                      {new Date(profile.subscription_expires_at).getTime() >= now.getTime()
                        ? `jusqu'au ${new Date(profile.subscription_expires_at).toLocaleDateString("fr-FR")}`
                        : `expiré le ${new Date(profile.subscription_expires_at).toLocaleDateString("fr-FR")}`}
                    </span>
                  )}
                </div>
              ) : (
                <Badge variant="outline">Sans abonnement</Badge>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
