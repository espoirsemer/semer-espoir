-- Permet à un administrateur de nommer un parent administrateur (ou
-- inversement), directement depuis le panel admin. La policy de mise à
-- jour "sur son propre profil" (0001) reste active en parallèle : Postgres
-- combine les policies permissives d'une même commande avec un OR.

create policy "profiles: admin met à jour tous les profils"
  on profiles for update
  using (public.is_admin())
  with check (public.is_admin());
