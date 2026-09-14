import { SiteHeader } from "@/components/landing/site-header";
import { Hero } from "@/components/landing/hero";
import { TrustBar } from "@/components/landing/trust-bar";
import { PainPoints } from "@/components/landing/pain-points";
import { Pillars } from "@/components/landing/pillars";
import { ModulesShowcase } from "@/components/landing/modules-showcase";
import { AboutSpecialist } from "@/components/landing/about-specialist";
import { Pricing } from "@/components/landing/pricing";
import { Testimonials } from "@/components/landing/testimonials";
import { Faq } from "@/components/landing/faq";
import { CtaBanner } from "@/components/landing/cta-banner";
import { SiteFooter } from "@/components/landing/site-footer";

export default function LandingPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <TrustBar />
        <PainPoints />
        <Pillars />
        <ModulesShowcase />
        <AboutSpecialist />
        <Pricing />
        <Testimonials />
        <Faq />
        <CtaBanner />
      </main>
      <SiteFooter />
    </>
  );
}
