import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { StyleSettings, StyleSettingsUpdate, DEFAULT_STYLES, GlobalButtonStyles, fontNameToValue } from "@/types/styles";

export const useStyleSettings = () => {
  return useQuery({
    queryKey: ["style-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("style_settings")
        .select("*")
        .eq("key", "global")
        .maybeSingle();

      if (error) throw error;
      
      // Return default values if no record found
      if (!data) {
        return {
          id: '',
          key: 'global',
          ...DEFAULT_STYLES,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as StyleSettings;
      }
      
      // Map database values to our interface, normalizing font names to CSS values
      return {
        ...data,
        title_font: fontNameToValue(data.title_font || 'Bebas Neue'),
        body_font: fontNameToValue(data.body_font || 'Nunito'),
        button_font: fontNameToValue(data.button_font || 'Nunito'),
        tag_font: fontNameToValue(data.tag_font || 'Nunito'),
        title_font_weight: data.title_font_weight ?? (data.title_font_bold ? 700 : 400),
        body_font_weight: data.body_font_weight ?? (data.body_font_bold ? 700 : 400),
        button_font_weight: data.button_font_weight ?? (data.button_font_bold ? 700 : 400),
        tag_font_weight: data.tag_font_weight ?? 400,
      } as StyleSettings;
    },
  });
};

export const useGlobalButtonStyles = (): GlobalButtonStyles & { isLoading: boolean } => {
  const { data, isLoading } = useStyleSettings();
  
  return {
    hamburgerBtnBgColor: data?.hamburger_btn_bg_color || DEFAULT_STYLES.hamburger_btn_bg_color,
    hamburgerBtnIconColor: data?.hamburger_btn_icon_color || DEFAULT_STYLES.hamburger_btn_icon_color,
    filterBtnBgColor: data?.filter_btn_bg_color || DEFAULT_STYLES.filter_btn_bg_color,
    filterBtnIconColor: data?.filter_btn_icon_color || DEFAULT_STYLES.filter_btn_icon_color,
    filterBtnActiveBgColor: data?.filter_btn_active_bg_color || DEFAULT_STYLES.filter_btn_active_bg_color,
    isLoading,
  };
};

export const useUpdateStyleSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: StyleSettingsUpdate) => {
      const { data, error } = await supabase
        .from("style_settings")
        .update(updates)
        .eq("key", "global")
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["style-settings"] });
      toast.success("Stili salvati con successo!");
    },
    onError: (error) => {
      toast.error("Errore nel salvataggio: " + error.message);
    },
  });
};
