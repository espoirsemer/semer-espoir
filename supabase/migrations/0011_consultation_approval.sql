-- Les demandes de rendez-vous nécessitent désormais l'approbation de la
-- spécialiste avant d'être confirmées. Le créneau reste réservé dès la
-- demande (get_available_slots() exclut déjà tout créneau ayant une ligne
-- de réservation, quel que soit son statut), donc aucun autre parent ne
-- peut choisir un créneau déjà demandé, même en attente d'approbation.

alter table consultation_bookings
  add column status text not null default 'pending' check (status in ('pending', 'confirmed')),
  add column updated_at timestamptz not null default now();

create function public.set_consultation_booking_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger consultation_bookings_set_updated_at
before update on consultation_bookings
for each row execute procedure public.set_consultation_booking_updated_at();

create policy "bookings: admin approuve"
  on consultation_bookings for update
  using (public.is_admin())
  with check (public.is_admin());

-- La messagerie avec la spécialiste ne s'ouvre qu'une fois le rendez-vous
-- confirmé (et non plus dès la simple demande).
drop policy "specialist_messages: parent ecrit apres rdv, admin toujours" on specialist_messages;

create policy "specialist_messages: parent ecrit apres rdv confirme, admin toujours"
  on specialist_messages for insert
  with check (
    auth.uid() = sender_id
    and (
      public.is_admin()
      or (
        auth.uid() = parent_id
        and exists (
          select 1 from consultation_bookings b
          where b.parent_id = auth.uid() and b.status = 'confirmed'
        )
      )
    )
  );
