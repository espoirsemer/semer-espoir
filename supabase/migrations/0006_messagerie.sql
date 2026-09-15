-- Messagerie privée entre parents (entraide peer-to-peer, module 3 élargi).
-- Indépendant des canaux communautaires modérés : ouvert à toutes les
-- formules, car "ne plus être seul·e" est la promesse de base de Semer Espoir.

create table direct_conversations (
  id uuid primary key default uuid_generate_v4(),
  parent_a_id uuid not null references profiles (id) on delete cascade,
  parent_b_id uuid not null references profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint direct_conversations_ordered check (parent_a_id < parent_b_id),
  unique (parent_a_id, parent_b_id)
);

create table direct_messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid not null references direct_conversations (id) on delete cascade,
  sender_id uuid not null references profiles (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  read_at timestamptz
);

alter table direct_conversations enable row level security;
alter table direct_messages enable row level security;

create policy "conversations: lecture par les deux participants"
  on direct_conversations for select
  using (auth.uid() = parent_a_id or auth.uid() = parent_b_id);

create policy "conversations: creation par un participant"
  on direct_conversations for insert
  with check (auth.uid() = parent_a_id or auth.uid() = parent_b_id);

create policy "messages: lecture par les participants de la conversation"
  on direct_messages for select
  using (
    exists (
      select 1 from direct_conversations c
      where c.id = conversation_id
        and (auth.uid() = c.parent_a_id or auth.uid() = c.parent_b_id)
    )
  );

create policy "messages: envoi par un participant de la conversation"
  on direct_messages for insert
  with check (
    auth.uid() = sender_id
    and exists (
      select 1 from direct_conversations c
      where c.id = conversation_id
        and (auth.uid() = c.parent_a_id or auth.uid() = c.parent_b_id)
    )
  );

-- Recherche d'autres parents pour démarrer une conversation : la RLS de
-- `profiles` limite la lecture au propre profil, cette fonction expose
-- uniquement id + full_name des parents (rien de sensible).
create function public.search_parents(search_query text)
returns table(id uuid, full_name text)
language sql
security definer
set search_path = public
stable
as $$
  select id, full_name from profiles
  where role = 'parent'
    and id != auth.uid()
    and (search_query = '' or full_name ilike '%' || search_query || '%')
  order by full_name
  limit 20;
$$;

grant execute on function public.search_parents(text) to authenticated;
