import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { StyleSettings, StyleSettingsUpdate, DEFAULT_STYLES } from "@/types/styles";

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
      
      return data as StyleSettings;
    },
  });
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
