import type { ReactNode } from "react";

const URL_SPLIT_PATTERN = /(https?:\/\/[^\s]+)/g;
const URL_TEST_PATTERN = /^https?:\/\/[^\s]+$/;

// Transforme les URL présentes dans un texte brut en liens cliquables —
// utile notamment pour le lien d'appel envoyé comme message texte.
export function linkify(text: string): ReactNode[] {
  const parts = text.split(URL_SPLIT_PATTERN);
  return parts.map((part, i) =>
    URL_TEST_PATTERN.test(part) ? (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noreferrer"
        className="underline underline-offset-2 hover:opacity-80"
      >
        {part}
      </a>
    ) : (
      part
    ),
  );
}
