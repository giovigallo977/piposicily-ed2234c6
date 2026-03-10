import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const usePremiumStatus = () => {
  const { user } = useAuth();

  const { data: isPremium = false, isLoading } = useQuery({
    queryKey: ["premium-status", user?.id],
    queryFn: async () => {
      if (!user) return false;

      // Check profiles table
      const { data: profileData } = await supabase
        .from("profiles")
        .select("is_premium")
        .eq("user_id", user.id)
        .single();

      if (profileData?.is_premium) return true;

      // Check granted_emails table
      if (user.email) {
        const { data: grantedData } = await supabase
          .from("granted_emails")
          .select("id")
          .eq("email", user.email)
          .maybeSingle();

        if (grantedData) return true;
      }

      return false;
    },
    enabled: !!user,
    staleTime: 30_000,
  });

  return { isPremium, isLoading, isAuthenticated: !!user };
};
