# Semer Espoir

SaaS hybride : formation des parents (LMS), communauté privée, journal de
bord clinique et panel admin pour une spécialiste de l'autisme.

## Stack

- **Frontend** : Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS v4, Shadcn/ui (base-ui).
- **Backend** : Supabase (PostgreSQL, Auth, Storage, Realtime).
- **Paiements** : Stripe Billing (3 tiers d'abonnement).
- **E-mails** : Brevo (API transactionnelle).
- **Déploiement** : Vercel.

## Démarrage

```bash
npm install
cp .env.local.example .env.local
```

Renseignez `.env.local` (voir ci-dessous), puis :

```bash
npm run dev
```

Sans configuration Supabase, les pages publiques (`/`, `/connexion`,
`/inscription`) fonctionnent normalement ; les pages protégées
(`/espace-parent`, `/admin`) afficheront une erreur tant que le projet
Supabase n'est pas branché — c'est attendu.

## Configuration

### 1. Supabase

1. Créer un projet sur [supabase.com](https://supabase.com).
2. Copier `Project URL` et `anon public key` (Settings → API) dans
   `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`, et la
   `service_role key` dans `SUPABASE_SERVICE_ROLE_KEY` (⚠️ jamais côté client).
3. Appliquer le schéma initial :

   ```bash
   npx supabase link --project-ref <votre-project-ref>
   npx supabase db push
   ```

   Le fichier [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql)
   crée les tables (profils, enfants, contenu, communauté, journal de bord)
   avec Row Level Security activée sur toutes les tables sensibles :
   un parent ne lit/écrit que ses propres données ; l'admin a un accès
   étendu au contenu et, pour le journal de bord, uniquement aux enfants
   des abonnés Tier 3 (VIP).
4. (Optionnel mais recommandé) Configurer le relais SMTP de Supabase Auth
   vers Brevo (Settings → Auth → SMTP Settings) pour que les e-mails de
   confirmation d'inscription partent via Brevo, comme prévu au cahier des
   charges.
5. Une fois le projet lié, régénérer les types TypeScript réels :

   ```bash
   npx supabase gen types typescript --linked > src/types/database.types.ts
   ```

### 2. Stripe

1. Créer 3 Produits/Prix récurrents (Tier 1 Autonomie, Tier 2 Guidance,
   Tier 3 VIP) dans le Dashboard Stripe.
2. Renseigner `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` et
   les 3 `STRIPE_PRICE_TIER_*`.
3. Créer un webhook pointant vers `/api/webhooks/stripe` (événements
   `customer.subscription.*`) et renseigner `STRIPE_WEBHOOK_SECRET`. En
   local : `stripe listen --forward-to localhost:3000/api/webhooks/stripe`.

### 3. Brevo

1. Créer une clé API transactionnelle sur [Brevo](https://www.brevo.com).
2. Renseigner `BREVO_API_KEY`, `BREVO_SENDER_EMAIL`, `BREVO_SENDER_NAME`.
   Utilisé par `src/lib/brevo.ts` pour les notifications de communauté et
   annonces admin (le mail de confirmation d'inscription, lui, passe par
   le relais SMTP Supabase configuré ci-dessus).

## Structure du projet

```
src/
  app/
    page.tsx                 Landing page
    (auth)/connexion|inscription     Module 1 — Authentification
    espace-parent/           Espace parent (protégé, layout + sidebar)
      hub/                   Module 2 — Hub de contenu (LMS)
      communaute/            Module 3 — Communauté privée
      journal/               Module 4 — Journal de bord + tendances
      profil/                Module 1 — Profil de l'enfant
    admin/                    Module 5 — Panel Admin (protégé, rôle admin)
    api/webhooks/stripe/      Module 6 — Synchronisation abonnements Stripe
  lib/
    supabase/                Clients Supabase (browser, server, proxy/session)
    stripe/                  Client Stripe + définition des 3 tiers
    brevo.ts                 Envoi d'e-mails transactionnels
    auth.ts                  Helpers requireProfile / requireAdmin (RLS-aware)
supabase/migrations/          Schéma SQL + policies RLS
```

Next.js 16 renomme `middleware.ts` en `proxy.ts` — voir
[`src/proxy.ts`](src/proxy.ts) : c'est lui qui rafraîchit la session
Supabase et protège `/espace-parent` et `/admin`.

## Prochaines étapes

Chaque page de module (`hub`, `communaute`, `journal`, `contenus`,
`abonnes`, …) est un squelette indiquant ce qui reste à construire. À
enchaîner module par module, en s'appuyant sur le schéma déjà posé dans
`supabase/migrations/0001_init.sql`.

## Déploiement

Le projet est prêt pour un déploiement Vercel standard. Penser à
renseigner toutes les variables de `.env.local.example` dans les
Environment Variables du projet Vercel.
