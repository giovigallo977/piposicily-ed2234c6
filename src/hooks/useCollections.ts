import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Collection {
  id: string;
  nome: string;
  descrizione: string;
  immagine: string;
  ordine: number;
  created_at: string;
  updated_at: string;
}

export type CollectionInsert = Omit<Collection, "id" | "created_at" | "updated_at">;
export type CollectionUpdate = Partial<CollectionInsert>;

export interface CollectionHotspot {
  id: string;
  collection_id: string;
  hotspot_id: string;
  ordine: number;
  created_at: string;
}

export const useCollections = () => {
  return useQuery({
    queryKey: ["collections"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("collections")
        .select("*")
        .order("ordine", { ascending: true });
      if (error) throw error;
      return data as Collection[];
    },
  });
};

export const useCollectionById = (id: string | undefined) => {
  return useQuery({
    queryKey: ["collections", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("collections")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data as Collection;
    },
  });
};

export const useCollectionHotspots = (collectionId: string | undefined) => {
  return useQuery({
    queryKey: ["collection_hotspots", collectionId],
    enabled: !!collectionId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("collection_hotspots")
        .select("*")
        .eq("collection_id", collectionId!)
        .order("ordine", { ascending: true });
      if (error) throw error;
      return data as CollectionHotspot[];
    },
  });
};

export const useCreateCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (collection: CollectionInsert) => {
      const { data, error } = await supabase
        .from("collections")
        .insert(collection)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      toast.success("Collezione creata!");
    },
    onError: (error) => toast.error("Errore: " + error.message),
  });
};

export const useUpdateCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: CollectionUpdate }) => {
      const { data, error } = await supabase
        .from("collections")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      toast.success("Collezione aggiornata!");
    },
    onError: (error) => toast.error("Errore: " + error.message),
  });
};

export const useDeleteCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("collections").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      toast.success("Collezione eliminata!");
    },
    onError: (error) => toast.error("Errore: " + error.message),
  });
};

export const useSyncCollectionHotspots = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ collectionId, hotspotIds }: { collectionId: string; hotspotIds: string[] }) => {
      // Delete existing
      const { error: deleteError } = await supabase
        .from("collection_hotspots")
        .delete()
        .eq("collection_id", collectionId);
      if (deleteError) throw deleteError;

      // Insert new
      if (hotspotIds.length > 0) {
        const rows = hotspotIds.map((hotspot_id, index) => ({
          collection_id: collectionId,
          hotspot_id,
          ordine: index,
        }));
        const { error: insertError } = await supabase
          .from("collection_hotspots")
          .insert(rows);
        if (insertError) throw insertError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collection_hotspots"] });
      toast.success("Hotspot della collezione aggiornati!");
    },
    onError: (error) => toast.error("Errore: " + error.message),
  });
};
