import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface FreeSpot {
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

export type FreeSpotInsert = Omit<FreeSpot, "id" | "created_at" | "updated_at">;
export type FreeSpotUpdate = Partial<FreeSpotInsert>;

export const useFreeSpots = () => {
  return useQuery({
    queryKey: ["free-spots"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("free_spots")
        .select("*")
        .order("ordine", { ascending: true });
      if (error) throw error;
      return data as FreeSpot[];
    },
  });
};

export const useCreateFreeSpot = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (spot: FreeSpotInsert) => {
      const { data, error } = await supabase
        .from("free_spots")
        .insert(spot)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["free-spots"] });
      toast.success("Free spot creato!");
    },
    onError: (error) => toast.error("Errore: " + error.message),
  });
};

export const useUpdateFreeSpot = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: FreeSpotUpdate }) => {
      const { data, error } = await supabase
        .from("free_spots")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["free-spots"] });
      toast.success("Free spot aggiornato!");
    },
    onError: (error) => toast.error("Errore: " + error.message),
  });
};

export const useDeleteFreeSpot = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("free_spots").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["free-spots"] });
      toast.success("Free spot eliminato!");
    },
    onError: (error) => toast.error("Errore: " + error.message),
  });
};
