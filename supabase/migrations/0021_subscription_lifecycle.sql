-- Suivi du cycle de vie de l'abonnement mensuel : jusqu'ici,
-- profiles.subscription_tier n'avait aucune date de fin (il n'existe même
-- pas d'action admin pour l'activer — seul un accès direct à la base le
-- permettait). Ajoute une date d'expiration et deux marqueurs d'e-mails
-- envoyés (idempotence du cron de rappel/expiration/suspension), remis à
-- zéro à chaque activation/renouvellement.

alter table profiles
  add column subscription_expires_at timestamptz,
  add column subscription_reminder_sent_at timestamptz,
  add column subscription_expired_sent_at timestamptz;
