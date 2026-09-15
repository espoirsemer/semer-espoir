import type { SubscriptionPlan, SubscriptionTier } from "@/types/database.types";

// Nom et fonctionnalités affichées par formule (statique) — seuls le prix et
// le lien de paiement sont éditables depuis le Panel Admin. Ce module ne doit
// importer aucun code serveur : il est utilisé par des Client Components.
export const PLAN_FEATURES: Record<SubscriptionTier, { name: string; features: string[] }> = {
  tier_1: {
    name: "Autonomie",
    features: ["Vidéothèque et boîte à outils", "Communauté en lecture seule"],
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

export const PLAN_ORDER: SubscriptionTier[] = ["tier_1", "tier_2", "tier_3"];

export function formatPrice(plan: SubscriptionPlan): string {
  if (plan.price_amount == null) return "Prix sur demande";
  const formatted = new Intl.NumberFormat("fr-FR").format(plan.price_amount);
  return `${formatted} ${plan.price_currency}`;
}
