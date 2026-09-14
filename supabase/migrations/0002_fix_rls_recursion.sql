-- Correctif : les policies "admin" de 0001 interrogeaient `profiles` depuis une
-- policy de `profiles` elle-même (exists (select ... from profiles ...)),
-- ce qui déclenche une récursion infinie RLS (erreur Postgres 42P17).
-- Fix standard Supabase : fonction security definer qui contourne la RLS
-- pour cette seule vérification de rôle.

create function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin');
$$;

-- profiles ------------------------------------------------------------------

drop policy "profiles: admin lit tous les profils" on profiles;

create policy "profiles: admin lit tous les profils"
  on profiles for select
  using (public.is_admin());

-- children --------------------------------------------------------------------

drop policy "children: admin lit tous les enfants" on children;

create policy "children: admin lit tous les enfants"
  on children for select
  using (public.is_admin());

-- content_items / content_categories ------------------------------------------

drop policy "contenu: admin gère tout" on content_items;

create policy "contenu: admin gère tout"
  on content_items for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy "categories: admin gère tout" on content_categories;

create policy "categories: admin gère tout"
  on content_categories for all
  using (public.is_admin())
  with check (public.is_admin());

-- community_channels / community_messages --------------------------------------

drop policy "canaux: admin gère les canaux" on community_channels;

create policy "canaux: admin gère les canaux"
  on community_channels for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy "messages: publication réservée tier 2+ et admin" on community_messages;

create policy "messages: publication réservée tier 2+ et admin"
  on community_messages for insert
  with check (
    auth.uid() = author_id
    and (
      public.is_admin()
      or exists (
        select 1 from profiles p
        where p.id = auth.uid() and p.subscription_tier in ('tier_2', 'tier_3')
      )
    )
  );

drop policy "messages: auteur ou admin peut modifier/supprimer" on community_messages;

create policy "messages: auteur ou admin peut modifier/supprimer"
  on community_messages for update
  using (auth.uid() = author_id or public.is_admin());

drop policy "messages: auteur ou admin peut supprimer" on community_messages;

create policy "messages: auteur ou admin peut supprimer"
  on community_messages for delete
  using (auth.uid() = author_id or public.is_admin());

-- journal_entries ---------------------------------------------------------------

drop policy "journal: admin lit les enfants des abonnés VIP" on journal_entries;

create policy "journal: admin lit les enfants des abonnés VIP"
  on journal_entries for select
  using (
    public.is_admin()
    and exists (
      select 1
      from children c
      join profiles p on p.id = c.parent_id
      where c.id = journal_entries.child_id
        and p.subscription_tier = 'tier_3'
    )
  );
