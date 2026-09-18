import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "./reveal";

const FAQ_ITEMS = [
  {
    question: "Semer Espoir remplace-t-il un suivi médical ou thérapeutique ?",
    answer:
      "Non. Semer Espoir vient en complément de l'accompagnement médical et thérapeutique de votre enfant — il ne le remplace pas. C'est un espace de formation, d'entraide et de suivi au quotidien.",
  },
  {
    question: "Puis-je utiliser la plateforme où que je sois dans le monde ?",
    answer:
      "Oui, Semer Espoir est entièrement en ligne et accessible partout, pensé pour les familles francophones du monde entier.",
  },
  {
    question: "Qui peut voir les données du journal de bord de mon enfant ?",
    answer:
      "Seul·e vous y avez accès. L'analyse des graphiques d'évolution par la spécialiste n'est pas encore incluse dans l'abonnement actuel — elle sera proposée prochainement, et jamais partagée avec les autres familles.",
  },
  {
    question: "Puis-je annuler mon abonnement à tout moment ?",
    answer:
      "Oui, vous gérez votre abonnement librement depuis votre espace parent, sans engagement de durée.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-6 py-20 sm:py-28">
      <Reveal>
        <h2 className="font-heading text-center text-2xl font-semibold tracking-tight sm:text-3xl">
          Questions fréquentes
        </h2>
      </Reveal>

      <Reveal delay={0.15}>
        <Accordion className="mt-10">
          {FAQ_ITEMS.map((item) => (
            <AccordionItem key={item.question} value={item.question}>
              <AccordionTrigger className="text-base">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>
    </section>
  );
}
