const STATEMENTS = [
  "Vous cherchez des réponses concrètes, pas juste de la théorie.",
  "Vous vous sentez seul·e face aux crises, aux regards, à l'incompréhension.",
  "Vous ne savez jamais si ce que vous faites au quotidien est vraiment adapté.",
  "Vous aimeriez qu'une spécialiste suive vraiment l'évolution de votre enfant.",
];

export function PainPoints() {
  return (
    <section className="border-y border-border/60 bg-muted/30">
      <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
        <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">
          Est-ce que ça vous parle ?
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {STATEMENTS.map((statement) => (
            <div
              key={statement}
              className="rounded-2xl border border-border/60 bg-background p-6 text-lg"
            >
              &laquo;&nbsp;{statement}&nbsp;&raquo;
            </div>
          ))}
        </div>
        <p className="mt-10 text-center text-lg text-muted-foreground">
          Vous n&apos;êtes pas seul&#8239;·&#8239;e à ressentir ça — et il existe un
          accompagnement pensé pour vous.
        </p>
      </div>
    </section>
  );
}
