import type { SubscriptionPlan, SubscriptionTier } from "@/types/database.types";

// Nom et fonctionnalités affichées par formule (statique) — seuls le prix et
// le lien de paiement sont éditables depuis le Panel Admin. Ce module ne doit
// importer aucun code serveur : il est utilisé par des Client Components.
export const PLAN_FEATURES: Record<SubscriptionTier, { name: string; features: string[] }> = {
  tier_1: {
    name: "Abonnement Semer Espoir",
    features: [
      "Accès complet à la communauté de parents",
      "Vidéothèque et boîte à outils",
      "De nouveaux avantages seront ajoutés progressivement",
    ],
  },
  tier_2: {
    name: "Guidance",
    features: [
      "Tout Autonomie",
      "Participation active à la communauté",
      "Accès aux Lives Q&A",
    ],
  },
  tier_3: {
    name: "VIP",
    features: [
      "Tout Guidance",
      "Journal de bord analysé par la spécialiste",
    ],
  },
};

// Un seul plan est vendu publiquement pour l'instant ; tier_2/tier_3 restent
// utilisables en interne (attribution manuelle) mais ne sont plus affichés.
export const PLAN_ORDER: SubscriptionTier[] = ["tier_1"];

export function formatPrice(plan: SubscriptionPlan): string {
  if (plan.price_amount == null) return "Prix sur demande";
  const formatted = new Intl.NumberFormat("fr-FR").format(plan.price_amount);
  return `${formatted} ${plan.price_currency}`;
}
