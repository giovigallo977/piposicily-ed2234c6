-- Tabella per le impostazioni di stile globali
CREATE TABLE public.style_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key text NOT NULL UNIQUE,
  -- Colori
  card_bg_color text DEFAULT '#FFFFFF',
  badge_bg_color text DEFAULT '#FDE68A',
  badge_text_color text DEFAULT '#166534',
  expand_btn_color text DEFAULT '#3a9f6d',
  cta_btn_color text DEFAULT '#FBBF24',
  cta_btn_text_color text DEFAULT '#166534',
  font_color text DEFAULT '#1F2937',
  -- Font titoli
  title_font text DEFAULT 'Bebas Neue',
  title_font_bold boolean DEFAULT true,
  title_font_size text DEFAULT 'xl',
  -- Font testi
  body_font text DEFAULT 'Nunito',
  body_font_bold boolean DEFAULT false,
  body_font_size text DEFAULT 'base',
  -- Font pulsanti
  button_font text DEFAULT 'Nunito',
  button_font_bold boolean DEFAULT true,
  button_font_size text DEFAULT 'sm',
  -- Timestamps
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Abilita RLS
ALTER TABLE public.style_settings ENABLE ROW LEVEL SECURITY;

-- Policy: lettura pubblica
CREATE POLICY "Style settings are publicly readable"
  ON public.style_settings FOR SELECT
  USING (true);

-- Policy: solo utenti autenticati possono modificare
CREATE POLICY "Authenticated users can update style settings"
  ON public.style_settings FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert style settings"
  ON public.style_settings FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Trigger per updated_at
CREATE TRIGGER update_style_settings_updated_at
  BEFORE UPDATE ON public.style_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Inserisci record default
INSERT INTO public.style_settings (key) VALUES ('global');

-- Aggiungi colonne di stile override alla tabella hotspots
ALTER TABLE public.hotspots
  ADD COLUMN style_card_bg_color text,
  ADD COLUMN style_badge_bg_color text,
  ADD COLUMN style_badge_text_color text,
  ADD COLUMN style_expand_btn_color text,
  ADD COLUMN style_cta_btn_color text,
  ADD COLUMN style_cta_btn_text_color text,
  ADD COLUMN style_font_color text,
  ADD COLUMN style_title_font text,
  ADD COLUMN style_title_font_bold boolean,
  ADD COLUMN style_title_font_size text,
  ADD COLUMN style_body_font text,
  ADD COLUMN style_body_font_bold boolean,
  ADD COLUMN style_body_font_size text,
  ADD COLUMN style_button_font text,
  ADD COLUMN style_button_font_bold boolean,
  ADD COLUMN style_button_font_size text;