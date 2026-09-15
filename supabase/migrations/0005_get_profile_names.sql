-- La RLS de `profiles` limite la lecture à son propre profil (+ admin).
-- C'est correct pour les données sensibles, mais empêche les parents de voir
-- le nom des autres membres dans la communauté. Cette fonction expose
-- uniquement id + full_name (rien de sensible), pour l'affichage des auteurs
-- de messages.

create function public.get_profile_names(profile_ids uuid[])
returns table(id uuid, full_name text)
language sql
security definer
set search_path = public
stable
as $$
  select id, full_name from profiles where id = any(profile_ids);
$$;

grant execute on function public.get_profile_names(uuid[]) to authenticated;
