-- Nouveau menu "Prise en charge à distance" : programme payant distinct de
-- la consultation ponctuelle, tarifé selon la condition de l'enfant
-- (autisme ou IMC). Même logique de paiement externe + confirmation
-- déclarative que les consultations (pas de vérification bancaire
-- automatique, la spécialiste recoupe la référence avant d'approuver).

create table remote_care_pricing (
  id boolean primary key default true,
  fee_autisme integer not null default 100000,
  fee_imc integer not null default 120000,
  currency text not null default 'FCFA',
  payment_link text,
  updated_at timestamptz not null default now(),
  constraint remote_care_pricing_singleton check (id)
);

insert into remote_care_pricing (id) values (true);

alter table remote_care_pricing enable row level security;

create policy "remote_care_pricing: lecture authentifiée"
  on remote_care_pricing for select
  to authenticated
  using (true);

create policy "remote_care_pricing: admin modifie"
  on remote_care_pricing for update
  using (public.is_admin())
  with check (public.is_admin());

create table remote_care_requests (
  id uuid primary key default uuid_generate_v4(),
  parent_id uuid not null references profiles (id) on delete cascade,
  child_id uuid references children (id) on delete set null,
  condition text not null check (condition in ('autisme', 'imc')),
  amount integer not null,
  currency text not null default 'FCFA',
  notes text,
  payment_reference text,
  payment_confirmed boolean not null default false,
  status text not null default 'pending' check (status in ('pending', 'confirmed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table remote_care_requests enable row level security;

create function public.set_remote_care_request_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger remote_care_requests_set_updated_at
before update on remote_care_requests
for each row execute procedure public.set_remote_care_request_updated_at();

create policy "remote_care_requests: parent lit les siennes, admin tout"
  on remote_care_requests for select
  using (auth.uid() = parent_id or public.is_admin());

create policy "remote_care_requests: parent demande pour lui-même, paiement confirmé"
  on remote_care_requests for insert
  with check (auth.uid() = parent_id and payment_confirmed = true);

create policy "remote_care_requests: parent supprime sa demande en attente"
  on remote_care_requests for delete
  using (auth.uid() = parent_id and status = 'pending');

create policy "remote_care_requests: admin met à jour et supprime"
  on remote_care_requests for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "remote_care_requests: admin supprime"
  on remote_care_requests for delete
  using (public.is_admin());
