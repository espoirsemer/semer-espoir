import { UserRound, Quote } from "lucide-react";
import { Reveal } from "./reveal";

export function AboutSpecialist() {
  return (
    <section id="specialiste" className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-amber-200/60 bg-gradient-to-br from-amber-50 to-orange-50/50 p-8 dark:border-amber-900/40 dark:from-amber-950/20 dark:to-orange-950/10 sm:p-12">
          <Quote className="absolute -top-2 right-8 size-24 text-amber-200/60 dark:text-amber-900/30" />

          <div className="relative grid items-center gap-10 sm:grid-cols-[auto_1fr]">
            <div className="flex size-28 items-center justify-center rounded-full bg-white text-amber-700 shadow-lg ring-4 ring-white dark:bg-amber-950 dark:text-amber-300 dark:ring-amber-950 sm:size-36">
              <UserRound className="size-14 sm:size-20" />
            </div>

            <div>
              <p className="text-sm font-medium tracking-wide text-amber-700 uppercase dark:text-amber-400">
                À propos de la spécialiste
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                [Prénom Nom], spécialiste de l&apos;autisme
              </h2>
              <p className="mt-4 text-muted-foreground">
                [Placeholder — à remplacer par la vraie biographie : parcours,
                années d&apos;expérience auprès des familles, approches
                utilisées (ex. ABA, Denver, TEACCH…), certifications, nombre de
                familles accompagnées.] Semer Espoir est né de la conviction
                que chaque famille mérite un accompagnement humain, accessible
                où qu&apos;elle se trouve dans le monde.
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
