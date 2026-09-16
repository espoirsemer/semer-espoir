-- Retire la messagerie privée entre parents (remplacée par un échange avec
-- la spécialiste, débloqué après un rendez-vous) et transforme la
-- Communauté en espace de groupe façon WhatsApp : ouverte à toutes les
-- formules, réactions emoji lisibles par tous, verrouillage par l'admin.

drop table if exists direct_messages;
drop table if exists direct_conversations;
drop function if exists public.search_parents(text);

-- 1. Communauté : verrouillage par canal ----------------------------------

alter table community_channels add column locked boolean not null default false;

drop policy "messages: publication réservée tier 2+ et admin" on community_messages;

create policy "messages: publication ouverte sauf verrouillage"
  on community_messages for insert
  with check (
    auth.uid() = author_id
    and (
      public.is_admin()
      or exists (
        select 1 from community_channels c
        where c.id = channel_id and c.locked = false
      )
    )
  );

-- Les réactions n'étaient lisibles que par leur propre auteur (policy "for
-- all" trop restrictive pour la lecture) : on ajoute une lecture publique
-- pour afficher les compteurs de réactions de tout le monde.
create policy "reactions: lecture authentifiee"
  on community_reactions for select
  to authenticated
  using (true);

-- 2. Messagerie avec la spécialiste, débloquée après un rendez-vous -------

create table specialist_messages (
  id uuid primary key default uuid_generate_v4(),
  parent_id uuid not null references profiles (id) on delete cascade,
  sender_id uuid not null references profiles (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

alter table specialist_messages enable row level security;

create policy "specialist_messages: lecture par le parent ou l'admin"
  on specialist_messages for select
  using (auth.uid() = parent_id or public.is_admin());

create policy "specialist_messages: parent ecrit apres rdv, admin toujours"
  on specialist_messages for insert
  with check (
    auth.uid() = sender_id
    and (
      public.is_admin()
      or (
        auth.uid() = parent_id
        and exists (select 1 from consultation_bookings b where b.parent_id = auth.uid())
      )
    )
  );
