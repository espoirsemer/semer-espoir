-- Passage à un plan d'abonnement unique (10 000 FCFA/mois). La migration
-- 0009 avait ouvert la publication dans la communauté à tout utilisateur
-- authentifié (indépendamment de l'abonnement, seul le verrouillage du
-- canal comptait) : on revient sur ce point pour que la publication active
-- redevienne un avantage de l'abonnement payant, quel que soit le tier
-- exact en base (au lieu d'exiger tier_2/tier_3 comme avant 0009). La
-- lecture reste ouverte à tous. Lives Q&A, Consultations et l'analyse du
-- journal par la spécialiste restent gérés par les policies existantes
-- (tier_2/tier_3) et ne sont donc plus accessibles depuis la vente
-- publique — ils seront proposés via une offre future à définir.

drop policy "messages: publication ouverte sauf verrouillage" on community_messages;

create policy "messages: publication réservée aux abonnés et admin"
  on community_messages for insert
  with check (
    auth.uid() = author_id
    and (
      public.is_admin()
      or (
        exists (
          select 1 from community_channels c
          where c.id = channel_id and c.locked = false
        )
        and exists (
          select 1 from profiles p
          where p.id = auth.uid() and p.subscription_tier is not null
        )
      )
    )
  );

update subscription_plans
set name = 'Abonnement Semer Espoir', price_amount = 10000, price_currency = 'FCFA'
where key = 'tier_1';
