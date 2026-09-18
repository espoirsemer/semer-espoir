import Image from "next/image";
import { MapPin, Clock, Phone } from "lucide-react";
import { Reveal } from "./reveal";

const AUDIENCES = [
  "Enfants autistes",
  "Enfants porteurs de trisomie",
  "Enfants atteints d'IMC (infirmité motrice cérébrale)",
  "Troubles neurodéveloppementaux : hyperactivité, troubles du langage, troubles de l'apprentissage",
];

export function AboutCentre() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium tracking-wide text-lime-400 uppercase">
          Le centre derrière Semer Espoir
        </p>
        <h2 className="font-heading mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
          La Classe Spécialisée ANLE
        </h2>
        <p className="mt-3 text-muted-foreground">
          Association Nouvelle Lueur d&apos;Espoir — un centre de prise en
          charge spécialisée des enfants à besoins spécifiques.
        </p>
      </Reveal>

      <Reveal delay={0.15} className="mt-14 grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="overflow-hidden rounded-2xl border-4 border-lime-500/20 bg-muted shadow-lg shadow-black/30">
          <Image
            src="/images/centre-anle.jpg"
            alt="Une éducatrice du centre ANLE accompagne un enfant dans l'apprentissage de l'autonomie"
            width={1200}
            height={900}
            className="h-full w-full object-cover"
            priority
          />
        </div>

        <div>
          <p className="text-muted-foreground">
            L&apos;accompagnement du centre vise trois axes principaux :
            l&apos;<strong className="text-foreground">autonomie</strong>, la{" "}
            <strong className="text-foreground">scolarisation</strong> et l&apos;
            <strong className="text-foreground">insertion sociale</strong>. Au
            quotidien : prise en charge éducative spécialisée, développement
            des capacités d&apos;apprentissage et de communication, et
            accompagnement de la famille à chaque étape.
          </p>

          <p className="mt-5 text-sm font-medium">Le centre accueille notamment :</p>
          <ul className="mt-3 space-y-2">
            {AUDIENCES.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-lime-500" />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-7 grid gap-3 rounded-2xl border border-lime-500/20 bg-lime-500/5 p-5 sm:grid-cols-2">
            <div className="flex items-start gap-2.5 text-sm">
              <MapPin className="mt-0.5 size-4 shrink-0 text-lime-400" />
              <span className="text-muted-foreground">
                Ndogpassi II, Douala — Cameroun
              </span>
            </div>
            <div className="flex items-start gap-2.5 text-sm">
              <Clock className="mt-0.5 size-4 shrink-0 text-lime-400" />
              <span className="text-muted-foreground">
                Lundi – vendredi, 7h30 – 13h00
              </span>
            </div>
            <div className="flex items-start gap-2.5 text-sm sm:col-span-2">
              <Phone className="mt-0.5 size-4 shrink-0 text-lime-400" />
              <span className="text-muted-foreground">
                (+237) 695 52 13 00 · (+237) 683 23 72 38
              </span>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
