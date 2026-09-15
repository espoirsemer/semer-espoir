-- Bucket privé pour les vidéos et PDF du Hub de contenu (module 2 & 5).
-- Lecture via URLs signées générées côté serveur ; écriture réservée à l'admin.

insert into storage.buckets (id, name, public)
values ('contenu', 'contenu', false)
on conflict (id) do nothing;

create policy "contenu-storage: lecture authentifiée"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'contenu');

create policy "contenu-storage: admin écrit"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'contenu' and public.is_admin());

create policy "contenu-storage: admin modifie"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'contenu' and public.is_admin());

create policy "contenu-storage: admin supprime"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'contenu' and public.is_admin());
