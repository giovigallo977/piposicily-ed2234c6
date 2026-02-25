
CREATE TABLE public.free_spot_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text UNIQUE NOT NULL,
  immagine text DEFAULT '',
  ordine integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.free_spot_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Free spot categories are publicly readable"
  ON public.free_spot_categories FOR SELECT USING (true);

CREATE POLICY "Authenticated users can update free spot categories"
  ON public.free_spot_categories FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert free spot categories"
  ON public.free_spot_categories FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

INSERT INTO public.free_spot_categories (nome, ordine) VALUES
  ('Lavorare', 1),
  ('Studiare', 2),
  ('Eat & Drink', 3);
