import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CtaBanner() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
      <div className="rounded-3xl bg-amber-600 px-8 py-14 text-center text-white sm:px-16">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Prêt·e à ne plus avancer seul&#8239;·&#8239;e ?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-amber-50">
          Rejoignez une communauté de parents qui se comprennent, et donnez à
          votre enfant les outils dont il a besoin dès aujourd&apos;hui.
        </p>
        <Link
          href="/inscription"
          className={cn(
            buttonVariants({ size: "lg" }),
            "mt-7 bg-white px-8 text-amber-700 hover:bg-amber-50",
          )}
        >
          Rejoindre la communauté
        </Link>
      </div>
    </section>
  );
}
