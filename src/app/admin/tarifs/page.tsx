import { getPricingPlans } from "@/lib/get-pricing-plans";
import { PlanForm } from "./plan-form";

export default async function AdminTarifsPage() {
  const plans = await getPricingPlans();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Tarifs</h1>
        <p className="text-muted-foreground">
          Prix et liens de paiement affichés sur la landing page, formule par
          formule.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {plans.map((plan) => (
          <PlanForm key={`${plan.key}-${plan.updated_at}`} plan={plan} />
        ))}
      </div>
    </div>
  );
}
