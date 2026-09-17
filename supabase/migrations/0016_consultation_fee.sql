-- Frais de consultation (15 000 FCFA par défaut, modifiable en admin) : le
-- parent doit confirmer avoir payé avant que sa demande ne parte vers la
-- spécialiste. Comme pour l'abonnement, le paiement se fait via un lien
-- externe (mobile money) — pas de vérification automatique, la spécialiste
-- peut recouper la référence indiquée par le parent avant d'approuver.

create table consultation_fee (
  id boolean primary key default true,
  amount integer not null default 15000,
  currency text not null default 'FCFA',
  payment_link text,
  updated_at timestamptz not null default now(),
  constraint consultation_fee_singleton check (id)
);

insert into consultation_fee (id, amount, currency) values (true, 15000, 'FCFA');

alter table consultation_fee enable row level security;

create policy "consultation_fee: lecture authentifiée"
  on consultation_fee for select
  to authenticated
  using (true);

create policy "consultation_fee: admin modifie"
  on consultation_fee for update
  using (public.is_admin())
  with check (public.is_admin());

alter table consultation_bookings
  add column payment_reference text,
  add column payment_confirmed boolean not null default false;
