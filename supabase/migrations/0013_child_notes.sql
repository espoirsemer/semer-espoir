-- Dossier clinique par enfant : la spécialiste peut noter, après chaque
-- consultation, les informations utiles issues de l'échange. Notes internes
-- réservées à la spécialiste (non visibles par les parents).

create table child_notes (
  id uuid primary key default uuid_generate_v4(),
  child_id uuid not null references children (id) on delete cascade,
  booking_id uuid references consultation_bookings (id) on delete set null,
  author_id uuid not null references profiles (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

alter table child_notes enable row level security;

create policy "child_notes: admin gere"
  on child_notes for all
  using (public.is_admin())
  with check (public.is_admin());
