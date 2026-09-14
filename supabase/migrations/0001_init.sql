-- Semer Espoir — schéma initial (v1, à affiner module par module)
-- Couvre : rôles, enfants, contenu LMS, communauté, journal de bord.
-- RLS activé partout : un parent n'accède qu'à ses propres données,
-- l'admin a un accès étendu (contenu + journaux des abonnés VIP éligibles).

create extension if not exists "uuid-ossp";

-- 1. Profils & rôles -----------------------------------------------------

create type user_role as enum ('parent', 'admin');
create type subscription_tier as enum ('tier_1', 'tier_2', 'tier_3');

create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role user_role not null default 'parent',
  full_name text,
  subscription_tier subscription_tier,
  stripe_customer_id text unique,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "profiles: lecture de son propre profil"
  on profiles for select
  using (auth.uid() = id);

create policy "profiles: modification de son propre profil"
  on profiles for update
  using (auth.uid() = id);

create policy "profiles: admin lit tous les profils"
  on profiles for select
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

-- Auto-création du profil (rôle "parent" par défaut) à l'inscription Supabase Auth.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. Enfants ---------------------------------------------------------------

create table children (
  id uuid primary key default uuid_generate_v4(),
  parent_id uuid not null references profiles (id) on delete cascade,
  first_name text not null,
  birth_date date,
  language_level text,
  sensory_sensitivities text[] default '{}',
  created_at timestamptz not null default now()
);

alter table children enable row level security;

create policy "children: le parent gère ses enfants"
  on children for all
  using (auth.uid() = parent_id)
  with check (auth.uid() = parent_id);

create policy "children: admin lit tous les enfants"
  on children for select
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

-- 3. Hub de contenu (LMS) ---------------------------------------------------

create table content_categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique
);

create type content_type as enum ('video', 'pdf');

create table content_items (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid references content_categories (id) on delete set null,
  type content_type not null,
  title text not null,
  description text,
  storage_path text not null,
  created_at timestamptz not null default now()
);

create table content_progress (
  profile_id uuid not null references profiles (id) on delete cascade,
  content_item_id uuid not null references content_items (id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (profile_id, content_item_id)
);

alter table content_categories enable row level security;
alter table content_items enable row level security;
alter table content_progress enable row level security;

create policy "contenu: lecture par tout utilisateur authentifié"
  on content_items for select
  using (auth.role() = 'authenticated');

create policy "categories: lecture par tout utilisateur authentifié"
  on content_categories for select
  using (auth.role() = 'authenticated');

create policy "contenu: admin gère tout"
  on content_items for all
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'))
  with check (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "categories: admin gère tout"
  on content_categories for all
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'))
  with check (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "progression: le parent gère sa progression"
  on content_progress for all
  using (auth.uid() = profile_id)
  with check (auth.uid() = profile_id);

-- 4. Communauté --------------------------------------------------------------

create table community_channels (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  created_at timestamptz not null default now()
);

create table community_messages (
  id uuid primary key default uuid_generate_v4(),
  channel_id uuid not null references community_channels (id) on delete cascade,
  author_id uuid not null references profiles (id) on delete cascade,
  parent_message_id uuid references community_messages (id) on delete cascade,
  body text not null,
  pinned boolean not null default false,
  created_at timestamptz not null default now()
);

create table community_reactions (
  message_id uuid not null references community_messages (id) on delete cascade,
  profile_id uuid not null references profiles (id) on delete cascade,
  emoji text not null,
  primary key (message_id, profile_id, emoji)
);

alter table community_channels enable row level security;
alter table community_messages enable row level security;
alter table community_reactions enable row level security;

create policy "canaux: lecture par tout utilisateur authentifié"
  on community_channels for select
  using (auth.role() = 'authenticated');

create policy "canaux: admin gère les canaux"
  on community_channels for all
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'))
  with check (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "messages: lecture par tout utilisateur authentifié"
  on community_messages for select
  using (auth.role() = 'authenticated');

-- Tier 1 = lecture seule : seuls tier_2, tier_3 et l'admin peuvent publier.
create policy "messages: publication réservée tier 2+ et admin"
  on community_messages for insert
  with check (
    auth.uid() = author_id
    and exists (
      select 1 from profiles p
      where p.id = auth.uid()
        and (p.role = 'admin' or p.subscription_tier in ('tier_2', 'tier_3'))
    )
  );

create policy "messages: auteur ou admin peut modifier/supprimer"
  on community_messages for update
  using (
    auth.uid() = author_id
    or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "messages: auteur ou admin peut supprimer"
  on community_messages for delete
  using (
    auth.uid() = author_id
    or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "reactions: gestion par leur auteur"
  on community_reactions for all
  using (auth.uid() = profile_id)
  with check (auth.uid() = profile_id);

-- 5. Journal de bord (données cliniques sensibles) --------------------------

create table journal_entries (
  id uuid primary key default uuid_generate_v4(),
  child_id uuid not null references children (id) on delete cascade,
  entry_date date not null default current_date,
  anxiety_level smallint not null check (anxiety_level between 1 and 5),
  triggers text[] default '{}',
  notes text,
  created_at timestamptz not null default now(),
  unique (child_id, entry_date)
);

alter table journal_entries enable row level security;

create policy "journal: le parent gère le journal de ses enfants"
  on journal_entries for all
  using (exists (select 1 from children c where c.id = child_id and c.parent_id = auth.uid()))
  with check (exists (select 1 from children c where c.id = child_id and c.parent_id = auth.uid()));

-- Supervision clinique : l'admin ne lit que les journaux des enfants dont
-- le parent est abonné Tier 3 (VIP).
create policy "journal: admin lit les enfants des abonnés VIP"
  on journal_entries for select
  using (
    exists (
      select 1
      from children c
      join profiles p on p.id = c.parent_id
      where c.id = journal_entries.child_id
        and p.subscription_tier = 'tier_3'
    )
    and exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );
