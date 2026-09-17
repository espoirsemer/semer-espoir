-- Ce sont désormais les parents (formules Guidance/VIP) qui proposent leur
-- propre créneau de consultation, et non la spécialiste qui publie des
-- créneaux à l'avance. La spécialiste garde la main pour approuver ou
-- décliner (suppression du créneau, qui entraîne celle de la réservation
-- par la contrainte on delete cascade déjà en place).

drop policy "slots: admin gere" on consultation_slots;

create policy "slots: admin gere tout"
  on consultation_slots for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "slots: parent propose son creneau"
  on consultation_slots for insert
  with check (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.subscription_tier in ('tier_2', 'tier_3')
    )
  );

create policy "slots: parent annule son propre creneau"
  on consultation_slots for delete
  using (
    exists (
      select 1 from consultation_bookings b
      where b.slot_id = consultation_slots.id and b.parent_id = auth.uid()
    )
  );
