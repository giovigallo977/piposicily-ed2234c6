
-- Tabella collections
CREATE TABLE public.collections (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nome text NOT NULL,
  descrizione text DEFAULT '',
  immagine text DEFAULT '',
  ordine integer DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Tabella ponte collection_hotspots
CREATE TABLE public.collection_hotspots (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  collection_id uuid NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
  hotspot_id uuid NOT NULL REFERENCES public.hotspots(id) ON DELETE CASCADE,
  ordine integer DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(collection_id, hotspot_id)
);

-- RLS
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_hotspots ENABLE ROW LEVEL SECURITY;

-- Policies collections
CREATE POLICY "Collections are publicly readable" ON public.collections FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert collections" ON public.collections FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update collections" ON public.collections FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can delete collections" ON public.collections FOR DELETE USING (auth.uid() IS NOT NULL);

-- Policies collection_hotspots
CREATE POLICY "Collection hotspots are publicly readable" ON public.collection_hotspots FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert collection hotspots" ON public.collection_hotspots FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update collection hotspots" ON public.collection_hotspots FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can delete collection hotspots" ON public.collection_hotspots FOR DELETE USING (auth.uid() IS NOT NULL);

-- Trigger updated_at
CREATE TRIGGER update_collections_updated_at BEFORE UPDATE ON public.collections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
