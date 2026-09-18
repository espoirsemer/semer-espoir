-- Contenu téléchargeable par formation (Ressources) : débloqué pour un
-- parent une fois que sa demande d'inscription est confirmée par la
-- spécialiste. Réutilise le bucket de stockage "contenu" déjà utilisé pour
-- le Hub, sous un préfixe distinct (resources/{formation_key}/...).

create table resource_formation_content (
  id uuid primary key default uuid_generate_v4(),
  formation_key text not null references resource_formations (key) on delete cascade,
  title text not null,
  type text not null check (type in ('video', 'pdf')),
  storage_path text not null,
  created_at timestamptz not null default now()
);

alter table resource_formation_content enable row level security;

create policy "resource_formation_content: admin gère"
  on resource_formation_content for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "resource_formation_content: parent lit si inscription confirmée"
  on resource_formation_content for select
  using (
    exists (
      select 1 from resource_purchases rp
      where rp.formation_key = resource_formation_content.formation_key
        and rp.parent_id = auth.uid()
        and rp.status = 'confirmed'
    )
  );
