-- Permet de joindre un fichier (photo, PDF, audio, vidéo) à un message de la
-- messagerie avec la spécialiste, comme dans la communauté. Réutilise le
-- même bucket Storage "communaute" (sous un préfixe de chemin distinct côté
-- application) pour éviter d'en recréer un et reconfigurer des politiques.

alter table specialist_messages
  add column attachment_path text,
  add column attachment_type text check (attachment_type in ('image', 'pdf', 'audio', 'video')),
  add column attachment_name text;
