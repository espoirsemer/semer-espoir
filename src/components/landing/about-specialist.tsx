import Image from "next/image";
import { Reveal } from "./reveal";

export function AboutSpecialist() {
  return (
    <section id="specialiste" className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl bg-stone-900 p-8 sm:p-12">
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] bg-[size:28px_28px]"
          />
          <div
            aria-hidden
            className="absolute -top-20 -right-20 size-72 rounded-full bg-emerald-500/10 blur-3xl"
          />
          <div className="relative grid items-center gap-10 sm:grid-cols-[auto_1fr]">
            <div className="size-28 shrink-0 overflow-hidden rounded-full bg-muted ring-4 ring-amber-500/40 sm:size-32">
              <Image
                src="/images/specialiste-carine-bakom.jpg"
                alt="Carine Dorothée Bakom"
                width={256}
                height={256}
                className="h-full w-full object-cover"
              />
            </div>

            <div>
              <p className="text-sm font-medium tracking-wide text-amber-400 uppercase">
                À propos de la spécialiste
              </p>
              <h2 className="font-heading mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Carine Dorothée Bakom
              </h2>
              <p className="mt-4 text-stone-300">
                Carine Dorothée Bakom accompagne au quotidien les enfants du
                centre ANLE et leurs familles, avec un objectif simple :
                donner à chaque enfant les moyens de gagner en autonomie, de
                suivre une scolarité adaptée et de trouver sa place dans la
                société. Semer Espoir est né de cette conviction : cet
                accompagnement ne doit pas s&apos;arrêter aux portes du
                centre, mais suivre chaque famille au quotidien, où qu&apos;elle
                se trouve.
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
