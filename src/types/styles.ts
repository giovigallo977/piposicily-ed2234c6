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
  // Global button colors
  hamburger_btn_bg_color: string;
  hamburger_btn_icon_color: string;
  filter_btn_bg_color: string;
  filter_btn_icon_color: string;
  filter_btn_active_bg_color: string;
  // Title font
  title_font: string;
  title_font_weight: number;
  title_font_size: string;
  title_font_bold?: boolean; // legacy, mapped to weight
  // Body font
  body_font: string;
  body_font_weight: number;
  body_font_size: string;
  body_font_bold?: boolean; // legacy
  // Button font
  button_font: string;
  button_font_weight: number;
  button_font_size: string;
  button_font_bold?: boolean; // legacy
  // Tag font
  tag_font: string;
  tag_font_size: string;
  tag_font_weight: number;
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
  style_title_font_weight?: number | null;
  style_title_font_size?: string | null;
  style_title_font_bold?: boolean | null; // legacy
  style_body_font?: string | null;
  style_body_font_weight?: number | null;
  style_body_font_size?: string | null;
  style_body_font_bold?: boolean | null; // legacy
  style_button_font?: string | null;
  style_button_font_weight?: number | null;
  style_button_font_size?: string | null;
  style_button_font_bold?: boolean | null; // legacy
  style_tag_font?: string | null;
  style_tag_font_size?: string | null;
  style_tag_font_weight?: number | null;
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
  titleFontWeight: number;
  titleFontSize: string;
  bodyFontFamily: string;
  bodyFontWeight: number;
  bodyFontSize: string;
  buttonFontFamily: string;
  buttonFontWeight: number;
  buttonFontSize: string;
  tagFontFamily: string;
  tagFontWeight: number;
  tagFontSize: string;
}

export interface GlobalButtonStyles {
  hamburgerBtnBgColor: string;
  hamburgerBtnIconColor: string;
  filterBtnBgColor: string;
  filterBtnIconColor: string;
  filterBtnActiveBgColor: string;
}

// Available fonts with their CSS values
export const AVAILABLE_FONTS = [
  { label: 'Nunito', value: "'Nunito', sans-serif" },
  { label: 'Bebas Neue', value: "'Bebas Neue', sans-serif" },
  { label: 'Playfair Display', value: "'Playfair Display', serif" },
  { label: 'Inter', value: "'Inter', sans-serif" },
  { label: 'More Sugar', value: "'More Sugar', cursive" },
  { label: 'Proxima Nova', value: "proxima-nova, sans-serif" },
  { label: 'Dreaming Outloud Sans', value: "'Dreaming Outloud Sans', sans-serif" },
] as const;

// Font weight options (3 levels)
export const FONT_WEIGHTS = [
  { label: 'Leggero', value: 300 },
  { label: 'Normale', value: 400 },
  { label: 'Grassetto', value: 700 },
] as const;

// Font sizes with numeric scale (10-40)
export const FONT_SIZE_SCALE = [
  { label: '10', value: '10' },
  { label: '12', value: '12' },
  { label: '14', value: '14' },
  { label: '16', value: '16' },
  { label: '18', value: '18' },
  { label: '20', value: '20' },
  { label: '24', value: '24' },
  { label: '28', value: '28' },
  { label: '32', value: '32' },
  { label: '36', value: '36' },
  { label: '40', value: '40' },
] as const;

// Legacy font sizes (for backward compatibility)
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
  tag: [
    { label: 'Extra Piccolo', value: 'xs' },
    { label: 'Piccolo', value: 'sm' },
    { label: 'Normale', value: 'base' },
    { label: 'Grande', value: 'lg' },
  ],
} as const;

// Convert font size value to CSS - supports both legacy (sm, base) and numeric (12, 16)
export const fontSizeToClass = (size: string): string => {
  // Check if it's a numeric value
  if (/^\d+$/.test(size)) {
    return ''; // We'll use inline style for numeric values
  }
  
  // Legacy Tailwind class mapping
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

// Convert font size value to inline CSS pixels
export const fontSizeToPx = (size: string): string | undefined => {
  if (/^\d+$/.test(size)) {
    return `${size}px`;
  }
  return undefined; // Use class instead
};

// Map CSS font value to simple name for database storage
export const fontValueToName = (value: string): string => {
  const font = AVAILABLE_FONTS.find(f => f.value === value);
  return font ? font.label : value;
};

// Map simple font name to CSS value
export const fontNameToValue = (name: string): string => {
  const font = AVAILABLE_FONTS.find(f => f.label === name);
  return font ? font.value : name;
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
  hamburger_btn_bg_color: '#FBBF24',
  hamburger_btn_icon_color: '#166534',
  filter_btn_bg_color: '#C4B5FD',
  filter_btn_icon_color: '#4C1D95',
  filter_btn_active_bg_color: '#EC4899',
  title_font: "'Bebas Neue', sans-serif",
  title_font_weight: 700,
  title_font_size: 'xl',
  body_font: "'Nunito', sans-serif",
  body_font_weight: 400,
  body_font_size: 'sm',
  button_font: "'Nunito', sans-serif",
  button_font_weight: 700,
  button_font_size: 'sm',
  tag_font: "'Nunito', sans-serif",
  tag_font_size: 'sm',
  tag_font_weight: 400,
};
