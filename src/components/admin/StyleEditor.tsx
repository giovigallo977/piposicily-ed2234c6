import { ColorPicker } from "./ColorPicker";
import { FontSelector } from "./FontSelector";
import { HotspotStyleOverrides, StyleSettings, StyleSettingsUpdate, fontNameToValue } from "@/types/styles";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Palette, Type, Layout } from "lucide-react";

interface StyleEditorProps {
  // For global styles
  globalStyles?: StyleSettings | null;
  onGlobalChange?: (updates: StyleSettingsUpdate) => void;
  // For hotspot overrides
  hotspotStyles?: HotspotStyleOverrides;
  onHotspotChange?: (updates: HotspotStyleOverrides) => void;
  // Mode
  mode: 'global' | 'hotspot';
  compact?: boolean;
}

export const StyleEditor = ({
  globalStyles,
  onGlobalChange,
  hotspotStyles,
  onHotspotChange,
  mode,
  compact = false,
}: StyleEditorProps) => {
  // Get current values based on mode
  const getValue = (globalKey: keyof StyleSettings, hotspotKey: keyof HotspotStyleOverrides): string => {
    if (mode === 'hotspot') {
      return (hotspotStyles?.[hotspotKey] as string) || '';
    }
    const value = globalStyles?.[globalKey];
    // For font fields, convert simple names to CSS values
    if (globalKey.includes('_font') && !globalKey.includes('_font_')) {
      return fontNameToValue(value as string || '');
    }
    return (value as string) || '';
  };

  const getNumberValue = (globalKey: keyof StyleSettings, hotspotKey: keyof HotspotStyleOverrides, defaultValue: number): number => {
    if (mode === 'hotspot') {
      return (hotspotStyles?.[hotspotKey] as number) ?? defaultValue;
    }
    return (globalStyles?.[globalKey] as number) ?? defaultValue;
  };

  // Handle changes based on mode
  const handleChange = (globalKey: keyof StyleSettingsUpdate, hotspotKey: keyof HotspotStyleOverrides, value: string | number | boolean) => {
    if (mode === 'hotspot' && onHotspotChange) {
      onHotspotChange({ [hotspotKey]: value || null });
    } else if (mode === 'global' && onGlobalChange) {
      onGlobalChange({ [globalKey]: value });
    }
  };

  const ColorsSection = () => (
    <div className={compact ? "space-y-3" : ""}>
      {!compact && (
        <div className="flex items-center gap-2 mb-4">
          <Palette className="h-5 w-5 text-olive" />
          <h3 className="font-semibold">Colori Schede</h3>
        </div>
      )}
      <div className={`grid ${compact ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4'} gap-4`}>
        <ColorPicker
          label="Sfondo Scheda"
          value={getValue('card_bg_color', 'style_card_bg_color')}
          onChange={(v) => handleChange('card_bg_color', 'style_card_bg_color', v)}
          description="Colore di sfondo della card"
        />
        <ColorPicker
          label="Badge Categoria (BG)"
          value={getValue('badge_bg_color', 'style_badge_bg_color')}
          onChange={(v) => handleChange('badge_bg_color', 'style_badge_bg_color', v)}
          description="Sfondo del badge categoria"
        />
        <ColorPicker
          label="Badge Categoria (Testo)"
          value={getValue('badge_text_color', 'style_badge_text_color')}
          onChange={(v) => handleChange('badge_text_color', 'style_badge_text_color', v)}
          description="Testo del badge categoria"
        />
        <ColorPicker
          label="Pulsante +"
          value={getValue('expand_btn_color', 'style_expand_btn_color')}
          onChange={(v) => handleChange('expand_btn_color', 'style_expand_btn_color', v)}
          description="Colore del pulsante espansione"
        />
        <ColorPicker
          label="Pulsante CTA (BG)"
          value={getValue('cta_btn_color', 'style_cta_btn_color')}
          onChange={(v) => handleChange('cta_btn_color', 'style_cta_btn_color', v)}
          description="Sfondo 'Incontra Pipo'"
        />
        <ColorPicker
          label="Pulsante CTA (Testo)"
          value={getValue('cta_btn_text_color', 'style_cta_btn_text_color')}
          onChange={(v) => handleChange('cta_btn_text_color', 'style_cta_btn_text_color', v)}
          description="Testo 'Incontra Pipo'"
        />
        <ColorPicker
          label="Colore Font"
          value={getValue('font_color', 'style_font_color')}
          onChange={(v) => handleChange('font_color', 'style_font_color', v)}
          description="Colore principale dei testi"
        />
      </div>
    </div>
  );

  const GlobalButtonsSection = () => {
    if (mode !== 'global') return null;
    
    return (
      <div className={compact ? "space-y-3" : ""}>
        {!compact && (
          <div className="flex items-center gap-2 mb-4">
            <Layout className="h-5 w-5 text-olive" />
            <h3 className="font-semibold">Pulsanti Globali (Header)</h3>
          </div>
        )}
        <div className={`grid ${compact ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3'} gap-4`}>
          <ColorPicker
            label="Hamburger (BG)"
            value={getValue('hamburger_btn_bg_color', 'style_card_bg_color')}
            onChange={(v) => handleChange('hamburger_btn_bg_color', 'style_card_bg_color', v)}
            description="Sfondo pulsante menu"
          />
          <ColorPicker
            label="Hamburger (Icona)"
            value={getValue('hamburger_btn_icon_color', 'style_card_bg_color')}
            onChange={(v) => handleChange('hamburger_btn_icon_color', 'style_card_bg_color', v)}
            description="Colore icona menu"
          />
          <ColorPicker
            label="Filtro (BG)"
            value={getValue('filter_btn_bg_color', 'style_card_bg_color')}
            onChange={(v) => handleChange('filter_btn_bg_color', 'style_card_bg_color', v)}
            description="Sfondo pulsante filtro"
          />
          <ColorPicker
            label="Filtro (Icona)"
            value={getValue('filter_btn_icon_color', 'style_card_bg_color')}
            onChange={(v) => handleChange('filter_btn_icon_color', 'style_card_bg_color', v)}
            description="Colore icona filtro"
          />
          <ColorPicker
            label="Filtro Attivo (BG)"
            value={getValue('filter_btn_active_bg_color', 'style_card_bg_color')}
            onChange={(v) => handleChange('filter_btn_active_bg_color', 'style_card_bg_color', v)}
            description="Sfondo quando filtro è attivo"
          />
        </div>
      </div>
    );
  };

  const FontsSection = () => (
    <div className={compact ? "space-y-3" : ""}>
      {!compact && (
        <div className="flex items-center gap-2 mb-4">
          <Type className="h-5 w-5 text-olive" />
          <h3 className="font-semibold">Font</h3>
        </div>
      )}
      <div className="space-y-4">
        <FontSelector
          label="🔤 Font Titoli"
          fontValue={getValue('title_font', 'style_title_font')}
          onFontChange={(v) => handleChange('title_font', 'style_title_font', v)}
          weightValue={getNumberValue('title_font_weight', 'style_title_font_weight', 700)}
          onWeightChange={(v) => handleChange('title_font_weight', 'style_title_font_weight', v)}
          sizeValue={getValue('title_font_size', 'style_title_font_size') || '20'}
          onSizeChange={(v) => handleChange('title_font_size', 'style_title_font_size', v)}
        />
        <FontSelector
          label="📝 Font Testi"
          fontValue={getValue('body_font', 'style_body_font')}
          onFontChange={(v) => handleChange('body_font', 'style_body_font', v)}
          weightValue={getNumberValue('body_font_weight', 'style_body_font_weight', 400)}
          onWeightChange={(v) => handleChange('body_font_weight', 'style_body_font_weight', v)}
          sizeValue={getValue('body_font_size', 'style_body_font_size') || '14'}
          onSizeChange={(v) => handleChange('body_font_size', 'style_body_font_size', v)}
        />
        <FontSelector
          label="🏷️ Font Tag"
          fontValue={getValue('tag_font', 'style_tag_font')}
          onFontChange={(v) => handleChange('tag_font', 'style_tag_font', v)}
          weightValue={getNumberValue('tag_font_weight', 'style_tag_font_weight', 400)}
          onWeightChange={(v) => handleChange('tag_font_weight', 'style_tag_font_weight', v)}
          sizeValue={getValue('tag_font_size', 'style_tag_font_size') || '14'}
          onSizeChange={(v) => handleChange('tag_font_size', 'style_tag_font_size', v)}
        />
        <FontSelector
          label="🔘 Font Pulsanti"
          fontValue={getValue('button_font', 'style_button_font')}
          onFontChange={(v) => handleChange('button_font', 'style_button_font', v)}
          weightValue={getNumberValue('button_font_weight', 'style_button_font_weight', 700)}
          onWeightChange={(v) => handleChange('button_font_weight', 'style_button_font_weight', v)}
          sizeValue={getValue('button_font_size', 'style_button_font_size') || '14'}
          onSizeChange={(v) => handleChange('button_font_size', 'style_button_font_size', v)}
        />
      </div>
    </div>
  );

  if (compact) {
    return (
      <div className="space-y-6">
        <ColorsSection />
        <FontsSection />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Colori Schede
          </CardTitle>
          <CardDescription>
            Personalizza i colori delle schede hotspot
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ColorsSection />
        </CardContent>
      </Card>

      {mode === 'global' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layout className="h-5 w-5" />
              Pulsanti Globali
            </CardTitle>
            <CardDescription>
              Colori dei pulsanti hamburger e filtro nell'header
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GlobalButtonsSection />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="h-5 w-5" />
            Tipografia
          </CardTitle>
          <CardDescription>
            Configura font, dimensioni e pesi del testo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FontsSection />
        </CardContent>
      </Card>
    </div>
  );
};
