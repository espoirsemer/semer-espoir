-- Lives Q&A : appels de groupe / webinaires que la spécialiste programme
-- "quand nécessaire" (module 3 & 6 — accès Guidance/VIP + admin).

create table live_sessions (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  starts_at timestamptz not null,
  meeting_url text not null,
  created_at timestamptz not null default now()
);

alter table live_sessions enable row level security;

create policy "lives: lecture guidance vip admin"
  on live_sessions for select
  using (
    public.is_admin()
    or exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.subscription_tier in ('tier_2', 'tier_3')
    )
  );

create policy "lives: admin gere"
  on live_sessions for all
  using (public.is_admin())
  with check (public.is_admin());
