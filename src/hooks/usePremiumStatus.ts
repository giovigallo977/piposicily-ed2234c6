import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const usePremiumStatus = () => {
  const { user } = useAuth();

  const { data: isPremium = false, isLoading } = useQuery({
    queryKey: ["premium-status", user?.id],
    queryFn: async () => {
      if (!user) return false;
      // First check local profile
      const { data } = await supabase
        .from("profiles")
        .select("is_premium")
        .eq("user_id", user.id)
        .single();
      if (data?.is_premium) return true;

      // If not premium locally, verify with Stripe
      try {
        const { data: verifyData } = await supabase.functions.invoke("verify-payment");
        if (verifyData?.isPremium) return true;
      } catch {}

      return false;
    },
    enabled: !!user,
    staleTime: 30_000,
  });

  return { isPremium, isLoading, isAuthenticated: !!user };
};
