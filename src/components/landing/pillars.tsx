import { GraduationCap, MessagesSquare, LineChart } from "lucide-react";

const PILLARS = [
  {
    icon: GraduationCap,
    title: "Vous former",
    description:
      "Des vidéos et des ressources terrain conçues par une spécialiste de l'autisme, pour agir avec des outils qui fonctionnent vraiment.",
  },
  {
    icon: MessagesSquare,
    title: "Ne plus être seul·e",
    description:
      "Une communauté privée de parents qui vivent la même chose que vous, organisée par sujets : sommeil, alimentation, scolarité, petites victoires.",
  },
  {
    icon: LineChart,
    title: "Suivre les progrès",
    description:
      "Un journal de bord quotidien qui prend moins d'une minute, et qui révèle des tendances utiles pour vous et pour la spécialiste.",
  },
];

export function Pillars() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Un accompagnement à trois piliers
        </h2>
        <p className="mt-3 text-muted-foreground">
          Parce que l&apos;autisme se vit au quotidien, pas seulement en
          consultation.
        </p>
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-3">
        {PILLARS.map((pillar) => (
          <div key={pillar.title} className="flex flex-col items-center text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
              <pillar.icon className="size-7" />
            </div>
            <h3 className="mt-5 text-lg font-medium">{pillar.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {pillar.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
