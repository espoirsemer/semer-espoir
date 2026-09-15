import { Globe2, ShieldCheck, HeartHandshake, Sprout } from "lucide-react";

const ITEMS = [
  { icon: Globe2, label: "Accessible partout, 100% en ligne" },
  { icon: ShieldCheck, label: "Vos données protégées et confidentielles" },
  { icon: HeartHandshake, label: "Porté par le centre ANLE, à Douala" },
  { icon: Sprout, label: "3 formules, sans engagement" },
];

export function TrustBar() {
  return (
    <section className="border-y border-border/60 bg-muted/20">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 py-8 sm:grid-cols-4">
        {ITEMS.map((item) => (
          <div
            key={item.label}
            className="flex flex-col items-center gap-2 text-center sm:flex-row sm:text-left"
          >
            <item.icon className="size-5 shrink-0 text-amber-600 dark:text-amber-400" />
            <span className="text-sm text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
