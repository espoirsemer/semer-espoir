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
import type { ResourceFormationKey } from "@/types/database.types";
import { addFormationContent } from "./actions";

export function ContentForm({ formationKey }: { formationKey: ResourceFormationKey }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(addFormationContent, null);

  if (state === "success" && open) {
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        Ajouter un contenu
      </DialogTrigger>
      <DialogContent>
        <form action={formAction}>
          <input type="hidden" name="formation_key" value={formationKey} />
          <DialogHeader>
            <DialogTitle>Ajouter une vidéo ou un PDF</DialogTitle>
            <DialogDescription>
              Débloqué pour les parents dont l&apos;inscription à cette
              formation est confirmée.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor={`title-${formationKey}`}>Titre</Label>
              <Input id={`title-${formationKey}`} name="title" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`type-${formationKey}`}>Type</Label>
              <select
                id={`type-${formationKey}`}
                name="type"
                required
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="video">Vidéo</option>
                <option value="pdf">PDF</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`file-${formationKey}`}>Fichier</Label>
              <Input
                id={`file-${formationKey}`}
                name="file"
                type="file"
                required
                accept="video/*,.pdf"
              />
            </div>
            {state && state !== "success" && (
              <p className="text-sm text-destructive">{state}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Envoi..." : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
