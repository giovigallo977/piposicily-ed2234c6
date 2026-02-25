import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Users, Crown } from "lucide-react";

interface Profile {
  id: string;
  user_id: string;
  email: string | null;
  is_premium: boolean;
  premium_since: string | null;
  created_at: string;
}

const AdminUsersTab = () => {
  const { data: profiles, isLoading } = useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data as Profile[];
    },
  });

  const totalUsers = profiles?.length ?? 0;
  const premiumUsers = profiles?.filter((p) => p.is_premium).length ?? 0;

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Users className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="text-2xl font-bold">{totalUsers}</p>
              <p className="text-xs text-muted-foreground">Utenti registrati</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Crown className="h-8 w-8 text-olive" />
            <div>
              <p className="text-2xl font-bold">{premiumUsers}</p>
              <p className="text-xs text-muted-foreground">Utenti Premium</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Registro Utenti</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-2 font-semibold text-muted-foreground">#</th>
                  <th className="text-left py-2 px-2 font-semibold text-muted-foreground">Email</th>
                  <th className="text-left py-2 px-2 font-semibold text-muted-foreground">Premium</th>
                  <th className="text-left py-2 px-2 font-semibold text-muted-foreground">Data Registrazione</th>
                  <th className="text-left py-2 px-2 font-semibold text-muted-foreground">Data Pagamento</th>
                </tr>
              </thead>
              <tbody>
                {profiles?.map((profile, index) => (
                  <tr key={profile.id} className="border-b border-border/50 hover:bg-muted/50">
                    <td className="py-2 px-2 text-muted-foreground">{index + 1}</td>
                    <td className="py-2 px-2 font-mono text-xs">{profile.email || "—"}</td>
                    <td className="py-2 px-2">
                      {profile.is_premium ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-olive text-olive-foreground">
                          <Crown className="w-3 h-3" /> Premium
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-xs">Free</span>
                      )}
                    </td>
                    <td className="py-2 px-2 text-xs text-muted-foreground">
                      {new Date(profile.created_at).toLocaleDateString("it-IT")}
                    </td>
                    <td className="py-2 px-2 text-xs text-muted-foreground">
                      {profile.premium_since
                        ? new Date(profile.premium_since).toLocaleDateString("it-IT")
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsersTab;
