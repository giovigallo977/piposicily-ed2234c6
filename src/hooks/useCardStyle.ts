import { useMemo } from "react";
import { useStyleSettings } from "./useStyleSettings";
import { CardStyle, DEFAULT_STYLES, HotspotStyleOverrides } from "@/types/styles";

/**
 * Hook that merges global style settings with hotspot-specific overrides
 * Hotspot overrides take precedence over global settings
 */
export const useCardStyle = (hotspotOverrides?: HotspotStyleOverrides): CardStyle & { isLoading: boolean } => {
  const { data: globalStyles, isLoading } = useStyleSettings();

  const cardStyle = useMemo(() => {
    // Start with defaults
    const base = globalStyles || {
      ...DEFAULT_STYLES,
      id: '',
      key: 'global',
      created_at: '',
      updated_at: '',
    };

    // Merge: hotspot override > global > default
    return {
      cardBgColor: hotspotOverrides?.style_card_bg_color || base.card_bg_color || DEFAULT_STYLES.card_bg_color,
      badgeBgColor: hotspotOverrides?.style_badge_bg_color || base.badge_bg_color || DEFAULT_STYLES.badge_bg_color,
      badgeTextColor: hotspotOverrides?.style_badge_text_color || base.badge_text_color || DEFAULT_STYLES.badge_text_color,
      expandBtnColor: hotspotOverrides?.style_expand_btn_color || base.expand_btn_color || DEFAULT_STYLES.expand_btn_color,
      ctaBtnColor: hotspotOverrides?.style_cta_btn_color || base.cta_btn_color || DEFAULT_STYLES.cta_btn_color,
      ctaBtnTextColor: hotspotOverrides?.style_cta_btn_text_color || base.cta_btn_text_color || DEFAULT_STYLES.cta_btn_text_color,
      fontColor: hotspotOverrides?.style_font_color || base.font_color || DEFAULT_STYLES.font_color,
      titleFontFamily: hotspotOverrides?.style_title_font || base.title_font || DEFAULT_STYLES.title_font,
      titleFontBold: hotspotOverrides?.style_title_font_bold ?? base.title_font_bold ?? DEFAULT_STYLES.title_font_bold,
      titleFontSize: hotspotOverrides?.style_title_font_size || base.title_font_size || DEFAULT_STYLES.title_font_size,
      bodyFontFamily: hotspotOverrides?.style_body_font || base.body_font || DEFAULT_STYLES.body_font,
      bodyFontBold: hotspotOverrides?.style_body_font_bold ?? base.body_font_bold ?? DEFAULT_STYLES.body_font_bold,
      bodyFontSize: hotspotOverrides?.style_body_font_size || base.body_font_size || DEFAULT_STYLES.body_font_size,
      buttonFontFamily: hotspotOverrides?.style_button_font || base.button_font || DEFAULT_STYLES.button_font,
      buttonFontBold: hotspotOverrides?.style_button_font_bold ?? base.button_font_bold ?? DEFAULT_STYLES.button_font_bold,
      buttonFontSize: hotspotOverrides?.style_button_font_size || base.button_font_size || DEFAULT_STYLES.button_font_size,
    };
  }, [globalStyles, hotspotOverrides]);

  return { ...cardStyle, isLoading };
};
