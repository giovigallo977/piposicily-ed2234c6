
ALTER TABLE public.collections
  ADD COLUMN rating_turistico integer DEFAULT 0,
  ADD COLUMN rating_relax integer DEFAULT 0,
  ADD COLUMN rating_natura integer DEFAULT 0,
  ADD COLUMN rating_sforzo integer DEFAULT 0,
  ADD COLUMN rating_tipo integer DEFAULT 0,
  ADD COLUMN mappa_immagine text DEFAULT '',
  ADD COLUMN mappa_link text DEFAULT '';

ALTER TABLE public.hotspots
  ADD COLUMN link_prenotazione text DEFAULT '';
