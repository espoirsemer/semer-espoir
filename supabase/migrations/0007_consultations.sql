-- Réservation de créneaux de consultation avec la spécialiste.
-- L'admin publie des créneaux ; les parents en formule Guidance ou VIP (ou
-- l'admin) peuvent en réserver un. Un créneau réservé disparaît de la liste
-- des disponibilités (1 réservation par créneau).

create table consultation_slots (
  id uuid primary key default uuid_generate_v4(),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  created_at timestamptz not null default now(),
  constraint consultation_slots_valid_range check (ends_at > starts_at)
);

create table consultation_bookings (
  id uuid primary key default uuid_generate_v4(),
  slot_id uuid not null unique references consultation_slots (id) on delete cascade,
  parent_id uuid not null references profiles (id) on delete cascade,
  child_id uuid references children (id) on delete set null,
  notes text,
  created_at timestamptz not null default now()
);

alter table consultation_slots enable row level security;
alter table consultation_bookings enable row level security;

create policy "slots: lecture authentifiée"
  on consultation_slots for select
  to authenticated
  using (true);

create policy "slots: admin gere"
  on consultation_slots for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "bookings: lecture par le parent ou l'admin"
  on consultation_bookings for select
  using (auth.uid() = parent_id or public.is_admin());

create policy "bookings: reservation par un parent guidance ou vip"
  on consultation_bookings for insert
  with check (
    auth.uid() = parent_id
    and (
      public.is_admin()
      or exists (
        select 1 from profiles p
        where p.id = auth.uid() and p.subscription_tier in ('tier_2', 'tier_3')
      )
    )
  );

create policy "bookings: annulation par le parent ou l'admin"
  on consultation_bookings for delete
  using (auth.uid() = parent_id or public.is_admin());

-- Créneaux réellement disponibles (non réservés, à venir) : contourne la RLS
-- de consultation_bookings (qui cache les réservations des autres parents)
-- pour ne renvoyer que les créneaux libres, sans exposer qui a réservé quoi.
create function public.get_available_slots()
returns setof consultation_slots
language sql
security definer
set search_path = public
stable
as $$
  select s.* from consultation_slots s
  where s.starts_at > now()
    and not exists (select 1 from consultation_bookings b where b.slot_id = s.id)
  order by s.starts_at;
$$;

grant execute on function public.get_available_slots() to authenticated;
