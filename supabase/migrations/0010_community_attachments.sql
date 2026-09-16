-- Permet de joindre un fichier (photo, PDF, audio, vidéo) à un message de la
-- communauté, côté parents comme côté spécialiste. Le fichier lui-même est
-- stocké dans le bucket Storage "communaute" (privé) ; on ne garde ici que
-- le chemin dans le bucket (une URL signée temporaire est générée à
-- l'affichage) et les métadonnées nécessaires.

alter table community_messages
  add column attachment_path text,
  add column attachment_type text check (attachment_type in ('image', 'pdf', 'audio', 'video')),
  add column attachment_name text;
