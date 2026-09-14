import { Check, PlayCircle, Users, NotebookPen } from "lucide-react";
import { cn } from "@/lib/utils";

const MODULES = [
  {
    icon: PlayCircle,
    title: "Le Hub de contenu",
    description:
      "Votre vidéothèque et votre boîte à outils, disponibles quand vous en avez besoin.",
    features: [
      "Vidéos de formation classées par thème",
      "Routines visuelles et plannings à pictogrammes prêts à imprimer",
      "Suivi de votre progression module par module",
    ],
  },
  {
    icon: Users,
    title: "La Communauté privée",
    description:
      "Un espace bienveillant pour poser vos questions sans jugement.",
    features: [
      "Canaux thématiques : sommeil, alimentation, scolarité…",
      "Fils de discussion et petites victoires du quotidien",
      "Lives Q&A avec la spécialiste (formules Guidance et VIP)",
    ],
  },
  {
    icon: NotebookPen,
    title: "Le Journal de bord",
    description:
      "Un suivi quotidien de moins d'une minute qui éclaire les progrès de votre enfant.",
    features: [
      "Niveau d'anxiété et déclencheurs en quelques clics",
      "Courbes de tendance sur le mois",
      "Analyse par la spécialiste avant vos consultations (formule VIP)",
    ],
  },
];

export function ModulesShowcase() {
  return (
    <section id="modules" className="border-y border-border/60 bg-muted/30">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Ce que vous trouverez dans votre espace
          </h2>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {MODULES.map((module, i) => (
            <div
              key={module.title}
              className={cn(
                "flex flex-col rounded-2xl border border-border/60 bg-background p-7",
                i === 1 && "lg:-translate-y-3 lg:shadow-lg",
              )}
            >
              <div className="flex size-11 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
                <module.icon className="size-6" />
              </div>
              <h3 className="mt-5 text-lg font-medium">{module.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {module.description}
              </p>
              <ul className="mt-5 space-y-2.5">
                {module.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
