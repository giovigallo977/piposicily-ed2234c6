import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

export interface SiteContent {
  id: string;
  key: string;
  content: string;
  created_at: string;
  updated_at: string;
}

// Global realtime subscription singleton
let realtimeInitialized = false;

const initRealtimeSync = (queryClient: ReturnType<typeof useQueryClient>) => {
  if (realtimeInitialized) return;
  realtimeInitialized = true;

  supabase
    .channel("site_content_changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "site_content" },
      (payload) => {
        const record = payload.new as SiteContent | undefined;
        if (record?.key) {
          queryClient.invalidateQueries({ queryKey: ["site-content", record.key] });
        } else {
          // For deletes, invalidate all
          queryClient.invalidateQueries({ queryKey: ["site-content"] });
        }
      }
    )
    .subscribe();
};

export const useSiteContent = (key: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    initRealtimeSync(queryClient);
  }, [queryClient]);

  return useQuery({
    queryKey: ["site-content", key],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_content" as any)
        .select("*")
        .eq("key", key)
        .maybeSingle();

      if (error) throw error;
      return data as unknown as SiteContent;
    },
  });
};

export const useUpdateSiteContent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ key, content }: { key: string; content: string }) => {
      const { data, error } = await supabase
        .from("site_content" as any)
        .upsert({ key, content }, { onConflict: "key" })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["site-content", variables.key] });
      toast({
        title: "Contenuto aggiornato",
        description: "Il contenuto è stato salvato con successo.",
      });
    },
    onError: (error) => {
      toast({
        title: "Errore",
        description: "Impossibile aggiornare il contenuto.",
        variant: "destructive",
      });
      console.error("Error updating site content:", error);
    },
  });
};

export const useHotspotCategories = () => {
  return useQuery({
    queryKey: ["hotspot-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hotspots")
        .select("categoria")
        .not("categoria", "is", null)
        .not("categoria", "eq", "");

      if (error) throw error;
      
      // Extract unique categories
      const categories = [...new Set(data.map((h) => h.categoria).filter(Boolean))] as string[];
      return categories.sort();
    },
  });
};
