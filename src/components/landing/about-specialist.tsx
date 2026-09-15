import Image from "next/image";
import { Reveal } from "./reveal";

export function AboutSpecialist() {
  return (
    <section id="specialiste" className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
      <Reveal>
        <div className="rounded-3xl border border-border/60 bg-muted/30 p-8 sm:p-12">
          <div className="grid items-center gap-10 sm:grid-cols-[auto_1fr]">
            <div className="size-28 shrink-0 overflow-hidden rounded-full ring-1 ring-border/60 sm:size-32">
              <Image
                src="/images/specialiste-carine-bakom.jpg"
                alt="Carine Dorothée Bakom"
                width={256}
                height={256}
                className="h-full w-full object-cover"
              />
            </div>

            <div>
              <p className="text-sm font-medium tracking-wide text-amber-700 uppercase dark:text-amber-400">
                À propos de la spécialiste
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                Carine Dorothée Bakom
              </h2>
              <p className="mt-4 text-muted-foreground">
                [Placeholder — à compléter avec le parcours de Carine Dorothée
                Bakom au sein du centre ANLE : formation, années
                d&apos;expérience auprès des familles, approches utilisées,
                certifications.] Semer Espoir prolonge en ligne
                l&apos;accompagnement du centre ANLE, pour que chaque famille
                puisse y accéder où qu&apos;elle se trouve.
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
