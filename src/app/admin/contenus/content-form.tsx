"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { ContentCategory } from "@/types/database.types";
import { createContentItem } from "./actions";

export function ContentForm({ categories }: { categories: ContentCategory[] }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(createContentItem, null);

  if (state === "success" && open) {
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>Ajouter une ressource</DialogTrigger>
      <DialogContent>
        <form action={formAction}>
          <DialogHeader>
            <DialogTitle>Ajouter une vidéo ou un PDF</DialogTitle>
            <DialogDescription>
              Le fichier est stocké de façon privée ; les parents y accèdent
              via un lien temporaire.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="title">Titre</Label>
              <Input id="title" name="title" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <select
                  id="type"
                  name="type"
                  required
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="video">Vidéo</option>
                  <option value="pdf">PDF</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category_id">Catégorie</Label>
                <select
                  id="category_id"
                  name="category_id"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="">Aucune</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="file">Fichier</Label>
              <Input id="file" name="file" type="file" required accept="video/*,.pdf" />
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
