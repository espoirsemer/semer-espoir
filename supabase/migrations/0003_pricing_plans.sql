-- Tarifs des 3 formules, éditables depuis le Panel Admin (module 5 & 6).
-- Lecture publique (landing page non authentifiée) + écriture réservée à l'admin.

create table subscription_plans (
  key subscription_tier primary key,
  name text not null,
  price_amount numeric,
  price_currency text not null default 'FCFA',
  payment_link text,
  updated_at timestamptz not null default now()
);

alter table subscription_plans enable row level security;

create policy "plans: lecture publique"
  on subscription_plans for select
  using (true);

create policy "plans: admin gère tout"
  on subscription_plans for all
  using (public.is_admin())
  with check (public.is_admin());

insert into subscription_plans (key, name) values
  ('tier_1', 'Autonomie'),
  ('tier_2', 'Guidance'),
  ('tier_3', 'VIP');
