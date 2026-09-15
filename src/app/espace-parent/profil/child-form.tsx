"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Child } from "@/types/database.types";
import { saveChild } from "./actions";

export function ChildForm({ child }: { child?: Child }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(saveChild, null);
  const isEdit = Boolean(child);

  if (state === "success" && open) {
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant={isEdit ? "outline" : "default"} size={isEdit ? "sm" : "default"} />
        }
      >
        {isEdit ? "Modifier" : "Ajouter un enfant"}
      </DialogTrigger>
      <DialogContent>
        <form action={formAction}>
          {child && <input type="hidden" name="id" value={child.id} />}
          <DialogHeader>
            <DialogTitle>{isEdit ? "Modifier le profil" : "Ajouter un enfant"}</DialogTitle>
            <DialogDescription>
              Ces informations aident la spécialiste à mieux accompagner votre
              enfant.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="first_name">Prénom</Label>
              <Input
                id="first_name"
                name="first_name"
                required
                defaultValue={child?.first_name}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birth_date">Date de naissance</Label>
              <Input
                id="birth_date"
                name="birth_date"
                type="date"
                defaultValue={child?.birth_date ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="language_level">Niveau de langage</Label>
              <Input
                id="language_level"
                name="language_level"
                placeholder="ex. quelques mots, phrases courtes…"
                defaultValue={child?.language_level ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sensory_sensitivities">
                Hypersensibilités sensorielles
              </Label>
              <Input
                id="sensory_sensitivities"
                name="sensory_sensitivities"
                placeholder="bruit, lumière vive, textures (séparées par des virgules)"
                defaultValue={child?.sensory_sensitivities.join(", ") ?? ""}
              />
            </div>
            {state && state !== "success" && (
              <p className="text-sm text-destructive">{state}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
