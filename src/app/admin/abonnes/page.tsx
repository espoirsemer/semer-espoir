import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/database.types";

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Abonnés</h1>
        <p className="text-muted-foreground">
          Rechercher un parent, consulter son dashboard enfant (Tier VIP).
        </p>
      </div>

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
                <Badge variant="secondary">{TIER_LABELS[profile.subscription_tier]}</Badge>
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
