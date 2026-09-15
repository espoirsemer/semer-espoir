import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { Child } from "@/types/database.types";
import { ChildForm } from "./child-form";
import { DeleteChildButton } from "./delete-child-button";

export default async function ProfilEnfantPage() {
  const profile = await requireProfile();
  const supabase = await createClient();
  const { data: children } = await supabase
    .from("children")
    .select("*")
    .eq("parent_id", profile.id)
    .order("created_at");

  const list = (children as Child[] | null) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Profil de l&apos;enfant</h1>
          <p className="text-muted-foreground">
            Prénom, âge, niveau de langage, hypersensibilités sensorielles.
          </p>
        </div>
        <ChildForm />
      </div>

      {list.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Aucun profil pour l&apos;instant</CardTitle>
            <CardDescription>
              Ajoutez le profil de votre enfant pour utiliser le journal de
              bord et personnaliser votre accompagnement.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {list.map((child) => (
            <Card key={child.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle>{child.first_name}</CardTitle>
                  <div className="flex gap-1">
                    <ChildForm child={child} />
                    <DeleteChildButton childId={child.id} />
                  </div>
                </div>
                <CardDescription className="space-y-2">
                  {child.birth_date && (
                    <span className="block">
                      Né(e) le{" "}
                      {new Date(child.birth_date).toLocaleDateString("fr-FR")}
                    </span>
                  )}
                  {child.language_level && (
                    <span className="block">
                      Langage : {child.language_level}
                    </span>
                  )}
                  {child.sensory_sensitivities.length > 0 && (
                    <span className="flex flex-wrap gap-1.5 pt-1">
                      {child.sensory_sensitivities.map((s) => (
                        <Badge key={s} variant="secondary">
                          {s}
                        </Badge>
                      ))}
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
