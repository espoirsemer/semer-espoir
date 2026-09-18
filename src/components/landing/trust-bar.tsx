import { Globe2, ShieldCheck, HeartHandshake, Sprout } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { icon: Globe2, label: "Accessible partout, 100% en ligne", tint: "text-amber-400" },
  { icon: ShieldCheck, label: "Vos données protégées et confidentielles", tint: "text-lime-400" },
  { icon: HeartHandshake, label: "Porté par le centre ANLE, à Douala", tint: "text-amber-400" },
  { icon: Sprout, label: "Un abonnement simple, sans engagement", tint: "text-lime-400" },
];

export function TrustBar() {
  return (
    <section className="border-y border-border/60 bg-black/20">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 py-8 sm:grid-cols-4">
        {ITEMS.map((item) => (
          <div
            key={item.label}
            className="flex flex-col items-center gap-2 text-center sm:flex-row sm:text-left"
          >
            <item.icon className={cn("size-5 shrink-0", item.tint)} />
            <span className="text-sm text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
