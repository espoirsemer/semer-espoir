import Stripe from "stripe";

// Instanciation paresseuse : évite de faire planter le build (collecte des
// routes API par Next.js) quand STRIPE_SECRET_KEY n'est pas encore configurée.
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-08-26.dahlia",
      typescript: true,
    });
  }
  return _stripe;
}
