import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { HotspotStyleOverrides } from "@/types/styles";

export interface Hotspot extends HotspotStyleOverrides {
  id: string;
  titolo: string;
  descrizione_breve: string;
  descrizione_completa: string;
  foto_principale: string;
  foto_gallery: string[];
  link_google_maps: string;
  categoria: string;
  tags: string[];
  ordine: number;
  created_at: string;
  updated_at: string;
}

export type HotspotInsert = Omit<Hotspot, "id" | "created_at" | "updated_at">;
export type HotspotUpdate = Partial<HotspotInsert>;

export const useHotspots = () => {
  return useQuery({
    queryKey: ["hotspots"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hotspots")
        .select("*")
        .order("ordine", { ascending: true });

      if (error) throw error;
      return data as Hotspot[];
    },
  });
};

export const useCreateHotspot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (hotspot: HotspotInsert) => {
      const { data, error } = await supabase
        .from("hotspots")
        .insert(hotspot)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hotspots"] });
      toast.success("Hotspot creato con successo!");
    },
    onError: (error) => {
      toast.error("Errore nella creazione: " + error.message);
    },
  });
};

export const useUpdateHotspot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: HotspotUpdate }) => {
      const { data, error } = await supabase
        .from("hotspots")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hotspots"] });
      toast.success("Hotspot aggiornato!");
    },
    onError: (error) => {
      toast.error("Errore nell'aggiornamento: " + error.message);
    },
  });
};

export const useDeleteHotspot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("hotspots")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hotspots"] });
      toast.success("Hotspot eliminato!");
    },
    onError: (error) => {
      toast.error("Errore nell'eliminazione: " + error.message);
    },
  });
};
