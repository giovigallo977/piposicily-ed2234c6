import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect } from "react";

export interface Hotspot {
  id: string;
  titolo: string;
  descrizione_breve: string;
  descrizione_completa: string;
  foto_principale: string | null;
  foto_gallery: string[] | null;
  link_google_maps: string | null;
  categoria: string | null;
  zona: string | null;
  tags: string[] | null;
  ordine: number | null;
  created_at: string;
  updated_at: string;
}

export type HotspotInsert = Omit<Hotspot, "id" | "created_at" | "updated_at">;
export type HotspotUpdate = Partial<HotspotInsert>;

// Global realtime subscription singleton
let realtimeInitialized = false;

const initHotspotsRealtime = (queryClient: ReturnType<typeof useQueryClient>) => {
  if (realtimeInitialized) return;
  realtimeInitialized = true;

  supabase
    .channel("hotspots_changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "hotspots" },
      () => {
        queryClient.invalidateQueries({ queryKey: ["hotspots"] });
        queryClient.invalidateQueries({ queryKey: ["hotspot-categories"] });
      }
    )
    .subscribe();
};

export const useHotspots = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    initHotspotsRealtime(queryClient);
  }, [queryClient]);

  return useQuery({
    queryKey: ["hotspots"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hotspots")
        .select("id, titolo, descrizione_breve, descrizione_completa, foto_principale, foto_gallery, link_google_maps, categoria, zona, tags, ordine, created_at, updated_at")
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
