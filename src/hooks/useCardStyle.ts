import { useMemo } from "react";
import { useStyleSettings } from "./useStyleSettings";
import { CardStyle, DEFAULT_STYLES, HotspotStyleOverrides, fontNameToValue } from "@/types/styles";

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

    // Helper to get font family (handles both CSS value and simple name)
    const getFontFamily = (value: string | null | undefined, fallback: string): string => {
      if (!value) return fontNameToValue(fallback);
      // Check if it's already a CSS value (contains quotes or comma)
      if (value.includes("'") || value.includes(',')) {
        return value;
      }
      // Convert simple name to CSS value
      return fontNameToValue(value);
    };

    // Helper to get font weight (handles legacy boolean + new numeric)
    const getFontWeight = (
      weightOverride: number | null | undefined,
      boldOverride: boolean | null | undefined,
      baseWeight: number | null | undefined,
      baseBold: boolean | null | undefined,
      defaultWeight: number
    ): number => {
      // Priority: weight override > bold override > base weight > base bold > default
      if (weightOverride != null) return weightOverride;
      if (boldOverride != null) return boldOverride ? 700 : 400;
      if (baseWeight != null) return baseWeight;
      if (baseBold != null) return baseBold ? 700 : 400;
      return defaultWeight;
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
      
      titleFontFamily: getFontFamily(hotspotOverrides?.style_title_font, base.title_font || DEFAULT_STYLES.title_font),
      titleFontWeight: getFontWeight(
        hotspotOverrides?.style_title_font_weight,
        hotspotOverrides?.style_title_font_bold,
        base.title_font_weight,
        base.title_font_bold,
        DEFAULT_STYLES.title_font_weight
      ),
      titleFontSize: hotspotOverrides?.style_title_font_size || base.title_font_size || DEFAULT_STYLES.title_font_size,
      
      bodyFontFamily: getFontFamily(hotspotOverrides?.style_body_font, base.body_font || DEFAULT_STYLES.body_font),
      bodyFontWeight: getFontWeight(
        hotspotOverrides?.style_body_font_weight,
        hotspotOverrides?.style_body_font_bold,
        base.body_font_weight,
        base.body_font_bold,
        DEFAULT_STYLES.body_font_weight
      ),
      bodyFontSize: hotspotOverrides?.style_body_font_size || base.body_font_size || DEFAULT_STYLES.body_font_size,
      
      buttonFontFamily: getFontFamily(hotspotOverrides?.style_button_font, base.button_font || DEFAULT_STYLES.button_font),
      buttonFontWeight: getFontWeight(
        hotspotOverrides?.style_button_font_weight,
        hotspotOverrides?.style_button_font_bold,
        base.button_font_weight,
        base.button_font_bold,
        DEFAULT_STYLES.button_font_weight
      ),
      buttonFontSize: hotspotOverrides?.style_button_font_size || base.button_font_size || DEFAULT_STYLES.button_font_size,
      
      tagFontFamily: getFontFamily(hotspotOverrides?.style_tag_font, base.tag_font || DEFAULT_STYLES.tag_font),
      tagFontWeight: hotspotOverrides?.style_tag_font_weight ?? base.tag_font_weight ?? DEFAULT_STYLES.tag_font_weight,
      tagFontSize: hotspotOverrides?.style_tag_font_size || base.tag_font_size || DEFAULT_STYLES.tag_font_size,
    };
  }, [globalStyles, hotspotOverrides]);

  return { ...cardStyle, isLoading };
};
