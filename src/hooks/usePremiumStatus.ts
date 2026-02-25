import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const usePremiumStatus = () => {
  const { user } = useAuth();

  const { data: isPremium = false, isLoading } = useQuery({
    queryKey: ["premium-status", user?.id],
    queryFn: async () => {
      if (!user) return false;
      const { data, error } = await supabase
        .from("profiles")
        .select("is_premium")
        .eq("user_id", user.id)
        .single();
      if (error || !data) return false;
      return data.is_premium;
    },
    enabled: !!user,
  });

  return { isPremium, isLoading, isAuthenticated: !!user };
};
