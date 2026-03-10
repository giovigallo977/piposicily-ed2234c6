import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Users, Crown, Gift, Trash2, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Profile {
  id: string;
  user_id: string;
  email: string | null;
  is_premium: boolean;
  premium_since: string | null;
  created_at: string;
}

interface GrantedEmail {
  id: string;
  email: string;
  created_at: string;
}

const AdminUsersTab = () => {
  const queryClient = useQueryClient();
  const [newEmail, setNewEmail] = useState("");

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

  const { data: grantedEmails, isLoading: grantedLoading } = useQuery({
    queryKey: ["granted-emails"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("granted_emails")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as GrantedEmail[];
    },
  });

  const addGrantedEmail = useMutation({
    mutationFn: async (email: string) => {
      const { error } = await supabase
        .from("granted_emails")
        .insert({ email: email.trim().toLowerCase() });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["granted-emails"] });
      setNewEmail("");
      toast({ title: "Email aggiunta", description: "L'utente avrà accesso premium al login." });
    },
    onError: (err: any) => {
      toast({ title: "Errore", description: err.message?.includes("duplicate") ? "Email già presente" : err.message, variant: "destructive" });
    },
  });

  const removeGrantedEmail = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("granted_emails")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["granted-emails"] });
      toast({ title: "Email rimossa" });
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
      {/* Regala Premium */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Gift className="h-5 w-5 text-olive" />
            Regala Premium
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (newEmail.trim()) addGrantedEmail.mutate(newEmail);
            }}
            className="flex gap-2"
          >
            <Input
              type="email"
              placeholder="email@esempio.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="flex-1"
              required
            />
            <Button type="submit" size="sm" disabled={addGrantedEmail.isPending}>
              {addGrantedEmail.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Aggiungi
            </Button>
          </form>

          {grantedLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          ) : grantedEmails && grantedEmails.length > 0 ? (
            <div className="space-y-2">
              {grantedEmails.map((ge) => (
                <div key={ge.id} className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-muted">
                  <div className="flex items-center gap-2">
                    <Crown className="h-3.5 w-3.5 text-olive" />
                    <span className="text-sm font-mono">{ge.email}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => removeGrantedEmail.mutate(ge.id)}
                    disabled={removeGrantedEmail.isPending}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic">Nessuna email regalata ancora.</p>
          )}
        </CardContent>
      </Card>

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
