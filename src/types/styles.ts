// Style settings types for the dynamic card styling system

export interface StyleSettings {
  id: string;
  key: string;
  // Colors
  card_bg_color: string;
  badge_bg_color: string;
  badge_text_color: string;
  expand_btn_color: string;
  cta_btn_color: string;
  cta_btn_text_color: string;
  font_color: string;
  // Title font
  title_font: string;
  title_font_bold: boolean;
  title_font_size: string;
  // Body font
  body_font: string;
  body_font_bold: boolean;
  body_font_size: string;
  // Button font
  button_font: string;
  button_font_bold: boolean;
  button_font_size: string;
  // Timestamps
  created_at: string;
  updated_at: string;
}

export type StyleSettingsUpdate = Partial<Omit<StyleSettings, 'id' | 'key' | 'created_at' | 'updated_at'>>;

export interface HotspotStyleOverrides {
  style_card_bg_color?: string | null;
  style_badge_bg_color?: string | null;
  style_badge_text_color?: string | null;
  style_expand_btn_color?: string | null;
  style_cta_btn_color?: string | null;
  style_cta_btn_text_color?: string | null;
  style_font_color?: string | null;
  style_title_font?: string | null;
  style_title_font_bold?: boolean | null;
  style_title_font_size?: string | null;
  style_body_font?: string | null;
  style_body_font_bold?: boolean | null;
  style_body_font_size?: string | null;
  style_button_font?: string | null;
  style_button_font_bold?: boolean | null;
  style_button_font_size?: string | null;
}

export interface CardStyle {
  cardBgColor: string;
  badgeBgColor: string;
  badgeTextColor: string;
  expandBtnColor: string;
  ctaBtnColor: string;
  ctaBtnTextColor: string;
  fontColor: string;
  titleFontFamily: string;
  titleFontBold: boolean;
  titleFontSize: string;
  bodyFontFamily: string;
  bodyFontBold: boolean;
  bodyFontSize: string;
  buttonFontFamily: string;
  buttonFontBold: boolean;
  buttonFontSize: string;
}

// Available fonts with their CSS values
export const AVAILABLE_FONTS = [
  { label: 'Nunito', value: "'Nunito', sans-serif" },
  { label: 'Bebas Neue', value: "'Bebas Neue', sans-serif" },
  { label: 'Playfair Display', value: "'Playfair Display', serif" },
  { label: 'Inter', value: "'Inter', sans-serif" },
  { label: 'More Sugar', value: "'More Sugar', cursive" },
  { label: 'Proxima Nova', value: "proxima-nova, sans-serif" },
] as const;

// Font sizes with their CSS values
export const FONT_SIZES = {
  title: [
    { label: 'Piccolo', value: 'sm' },
    { label: 'Normale', value: 'base' },
    { label: 'Grande', value: 'lg' },
    { label: 'Extra Grande', value: 'xl' },
    { label: 'XXL', value: '2xl' },
  ],
  body: [
    { label: 'Extra Piccolo', value: 'xs' },
    { label: 'Piccolo', value: 'sm' },
    { label: 'Normale', value: 'base' },
    { label: 'Grande', value: 'lg' },
  ],
  button: [
    { label: 'Extra Piccolo', value: 'xs' },
    { label: 'Piccolo', value: 'sm' },
    { label: 'Normale', value: 'base' },
    { label: 'Grande', value: 'lg' },
  ],
} as const;

// Map font size values to Tailwind classes
export const fontSizeToClass = (size: string): string => {
  const map: Record<string, string> = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
  };
  return map[size] || 'text-base';
};

// Default style values (fallback)
export const DEFAULT_STYLES: Omit<StyleSettings, 'id' | 'key' | 'created_at' | 'updated_at'> = {
  card_bg_color: '#FFFFFF',
  badge_bg_color: '#FDE68A',
  badge_text_color: '#166534',
  expand_btn_color: '#3a9f6d',
  cta_btn_color: '#FBBF24',
  cta_btn_text_color: '#166534',
  font_color: '#1F2937',
  title_font: "'Bebas Neue', sans-serif",
  title_font_bold: true,
  title_font_size: 'xl',
  body_font: "'Nunito', sans-serif",
  body_font_bold: false,
  body_font_size: 'sm',
  button_font: "'Nunito', sans-serif",
  button_font_bold: true,
  button_font_size: 'sm',
};
