-- Add new columns for tag styling and global button colors
-- Also add font_weight field (300=light, 400=normal, 700=bold)

-- Add tag styling columns to style_settings
ALTER TABLE public.style_settings 
ADD COLUMN IF NOT EXISTS tag_font text DEFAULT 'Nunito',
ADD COLUMN IF NOT EXISTS tag_font_size text DEFAULT 'sm',
ADD COLUMN IF NOT EXISTS tag_font_weight integer DEFAULT 400,
ADD COLUMN IF NOT EXISTS title_font_weight integer DEFAULT 700,
ADD COLUMN IF NOT EXISTS body_font_weight integer DEFAULT 400,
ADD COLUMN IF NOT EXISTS button_font_weight integer DEFAULT 700,
ADD COLUMN IF NOT EXISTS hamburger_btn_bg_color text DEFAULT '#FBBF24',
ADD COLUMN IF NOT EXISTS hamburger_btn_icon_color text DEFAULT '#166534',
ADD COLUMN IF NOT EXISTS filter_btn_bg_color text DEFAULT '#C4B5FD',
ADD COLUMN IF NOT EXISTS filter_btn_icon_color text DEFAULT '#4C1D95',
ADD COLUMN IF NOT EXISTS filter_btn_active_bg_color text DEFAULT '#EC4899';

-- Add tag styling columns to hotspots (for overrides)
ALTER TABLE public.hotspots
ADD COLUMN IF NOT EXISTS style_tag_font text,
ADD COLUMN IF NOT EXISTS style_tag_font_size text,
ADD COLUMN IF NOT EXISTS style_tag_font_weight integer,
ADD COLUMN IF NOT EXISTS style_title_font_weight integer,
ADD COLUMN IF NOT EXISTS style_body_font_weight integer,
ADD COLUMN IF NOT EXISTS style_button_font_weight integer;

-- Remove the old boolean bold columns (we now use font_weight)
-- Keep them for backward compatibility, we'll handle in code