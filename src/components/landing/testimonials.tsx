import { Quote } from "lucide-react";

const PLACEHOLDER_COUNT = 3;

export function Testimonials() {
  return (
    <section className="border-y border-border/60 bg-muted/30">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Ce qu&apos;en disent les familles
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            [Placeholder — à remplacer par de vrais témoignages avant la mise
            en ligne publique.]
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {Array.from({ length: PLACEHOLDER_COUNT }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col rounded-2xl border border-dashed border-border bg-background p-6"
            >
              <Quote className="size-6 text-amber-500" />
              <p className="mt-4 flex-1 text-sm text-muted-foreground italic">
                « [Témoignage à venir — expérience concrète d&apos;un parent
                avec Semer Espoir.] »
              </p>
              <p className="mt-4 text-sm font-medium">[Prénom], parent</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
