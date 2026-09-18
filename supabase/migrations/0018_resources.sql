-- Nouveau menu "Ressources" : trois formations payantes à tarif fixe
-- (nutrition, massage, langage). Même mécanique que les autres services
-- payants de la plateforme : paiement externe, confirmation déclarative du
-- parent, approbation manuelle par la spécialiste.

create table resource_formations (
  key text primary key check (key in ('nutrition', 'massage', 'langage')),
  name text not null,
  price_amount integer not null,
  price_currency text not null default 'FCFA',
  payment_link text,
  updated_at timestamptz not null default now()
);

insert into resource_formations (key, name, price_amount, price_currency) values
  ('nutrition', 'Livres pour nutrition', 50000, 'FCFA'),
  ('massage', 'Massage', 30000, 'FCFA'),
  ('langage', 'Langage (apprendre à parler)', 100000, 'FCFA');

alter table resource_formations enable row level security;

create policy "resource_formations: lecture authentifiée"
  on resource_formations for select
  to authenticated
  using (true);

create policy "resource_formations: admin modifie"
  on resource_formations for update
  using (public.is_admin())
  with check (public.is_admin());

create table resource_purchases (
  id uuid primary key default uuid_generate_v4(),
  parent_id uuid not null references profiles (id) on delete cascade,
  formation_key text not null references resource_formations (key),
  amount integer not null,
  currency text not null default 'FCFA',
  payment_reference text,
  payment_confirmed boolean not null default false,
  status text not null default 'pending' check (status in ('pending', 'confirmed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table resource_purchases enable row level security;

create function public.set_resource_purchase_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger resource_purchases_set_updated_at
before update on resource_purchases
for each row execute procedure public.set_resource_purchase_updated_at();

create policy "resource_purchases: parent lit les siennes, admin tout"
  on resource_purchases for select
  using (auth.uid() = parent_id or public.is_admin());

create policy "resource_purchases: parent achète pour lui-même, paiement confirmé"
  on resource_purchases for insert
  with check (auth.uid() = parent_id and payment_confirmed = true);

create policy "resource_purchases: parent supprime sa demande en attente"
  on resource_purchases for delete
  using (auth.uid() = parent_id and status = 'pending');

create policy "resource_purchases: admin met à jour"
  on resource_purchases for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "resource_purchases: admin supprime"
  on resource_purchases for delete
  using (public.is_admin());
