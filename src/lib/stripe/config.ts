// Définition des 3 tiers d'abonnement (cahier des charges, module 6).
export const SUBSCRIPTION_TIERS = {
  tier_1: {
    key: "tier_1",
    name: "Autonomie",
    priceId: process.env.STRIPE_PRICE_TIER_1,
    features: ["Vidéothèque et boîte à outils", "Communauté en lecture seule"],
  },
  tier_2: {
    key: "tier_2",
    name: "Guidance",
    priceId: process.env.STRIPE_PRICE_TIER_2,
    features: [
      "Tout Autonomie",
      "Participation active à la communauté",
      "Accès aux Lives Q&A",
    ],
  },
  tier_3: {
    key: "tier_3",
    name: "VIP",
    priceId: process.env.STRIPE_PRICE_TIER_3,
    features: [
      "Tout Guidance",
      "Journal de bord analysé par la spécialiste",
    ],
  },
} as const;

export type SubscriptionTierKey = keyof typeof SUBSCRIPTION_TIERS;
