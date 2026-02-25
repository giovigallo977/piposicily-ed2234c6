import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface FreeSpotCategory {
  id: string;
  nome: string;
  immagine: string;
  ordine: number;
  created_at: string;
  updated_at: string;
}

export const useFreeSpotCategories = () => {
  return useQuery({
    queryKey: ["free-spot-categories"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("free_spot_categories")
        .select("*")
        .order("ordine", { ascending: true });
      if (error) throw error;
      return data as FreeSpotCategory[];
    },
  });
};

export const useUpdateFreeSpotCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, immagine }: { id: string; immagine: string }) => {
      const { data, error } = await (supabase as any)
        .from("free_spot_categories")
        .update({ immagine })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["free-spot-categories"] });
      toast.success("Immagine categoria aggiornata!");
    },
    onError: (error: Error) => toast.error("Errore: " + error.message),
  });
};
