ALTER TABLE public.collections RENAME COLUMN rating_tipo TO rating_cultura;
ALTER TABLE public.collections ADD COLUMN info_prenotazioni text DEFAULT '';