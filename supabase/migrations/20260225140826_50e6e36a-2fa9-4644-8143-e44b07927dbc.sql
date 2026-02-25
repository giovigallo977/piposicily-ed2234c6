
CREATE TABLE public.free_spots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titolo text NOT NULL,
  descrizione_breve text NOT NULL DEFAULT '',
  descrizione_completa text NOT NULL DEFAULT '',
  foto_principale text DEFAULT '',
  foto_gallery text[] DEFAULT ARRAY[]::text[],
  link_google_maps text DEFAULT '',
  categoria text DEFAULT '',
  zona text DEFAULT '',
  tags text[] DEFAULT ARRAY[]::text[],
  ordine integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.free_spots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Free spots are publicly readable" ON public.free_spots
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert free spots" ON public.free_spots
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update free spots" ON public.free_spots
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete free spots" ON public.free_spots
  FOR DELETE USING (auth.uid() IS NOT NULL);

CREATE TRIGGER update_free_spots_updated_at
  BEFORE UPDATE ON public.free_spots
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
