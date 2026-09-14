import { UserRound } from "lucide-react";

export function AboutSpecialist() {
  return (
    <section id="specialiste" className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
      <div className="grid items-center gap-10 rounded-3xl border border-border/60 bg-muted/30 p-8 sm:grid-cols-[auto_1fr] sm:p-12">
        <div className="flex size-28 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 sm:size-36">
          <UserRound className="size-14 sm:size-20" />
        </div>

        <div>
          <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
            À propos de la spécialiste
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            [Prénom Nom], spécialiste de l&apos;autisme
          </h2>
          <p className="mt-4 text-muted-foreground">
            [Placeholder — à remplacer par la vraie biographie : parcours,
            années d&apos;expérience auprès des familles, approches utilisées
            (ex. ABA, Denver, TEACCH…), certifications, nombre de familles
            accompagnées.] Semer Espoir est né de la conviction que chaque
            famille mérite un accompagnement humain, accessible où qu&apos;elle
            se trouve dans le monde.
          </p>
        </div>
      </div>
    </section>
  );
}
