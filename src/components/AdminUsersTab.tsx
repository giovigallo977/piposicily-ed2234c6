import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Mail, Trash2, Plus, MapPin, FolderOpen, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface GrantedEmail {
  id: string;
  email: string;
  source: string | null;
  created_at: string;
}

interface WaitlistEmail {
  id: string;
  email: string;
  created_at: string;
}

const SOURCE_LABELS: Record<string, { label: string; icon: typeof MapPin; color: string }> = {
  hotspot_gate: { label: "Hotspot", icon: MapPin, color: "bg-blue-100 text-blue-700" },
  collection_gate: { label: "Itinerario", icon: FolderOpen, color: "bg-emerald-100 text-emerald-700" },
  gate_modal: { label: "Gate", icon: Mail, color: "bg-amber-100 text-amber-700" },
};

const AdminUsersTab = () => {
  const queryClient = useQueryClient();
  const [newEmail, setNewEmail] = useState("");

  const { data: grantedEmails, isLoading } = useQuery({
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

  const { data: waitlistEmails, isLoading: waitlistLoading } = useQuery({
    queryKey: ["experience-waitlist"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("experience_waitlist")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as WaitlistEmail[];
    },
  });

  const addGrantedEmail = useMutation({
    mutationFn: async (email: string) => {
      const { error } = await supabase
        .from("granted_emails")
        .insert({ email: email.trim().toLowerCase(), source: "manual" });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["granted-emails"] });
      setNewEmail("");
      toast({ title: "Email aggiunta" });
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

  const totalGate = grantedEmails?.length ?? 0;
  const totalWaitlist = waitlistEmails?.length ?? 0;
  const fromHotspot = grantedEmails?.filter(e => e.source === "hotspot_gate").length ?? 0;
  const fromCollection = grantedEmails?.filter(e => e.source === "collection_gate").length ?? 0;

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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{totalGate}</p>
            <p className="text-xs text-muted-foreground">Email Gate</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{fromHotspot}</p>
            <p className="text-xs text-muted-foreground">Da Hotspot</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{fromCollection}</p>
            <p className="text-xs text-muted-foreground">Da Itinerari</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{totalWaitlist}</p>
            <p className="text-xs text-muted-foreground">Waitlist Experience</p>
          </CardContent>
        </Card>
      </div>

      {/* Add manual email */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Aggiungi email manualmente
          </CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      {/* Gate emails table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email raccolte (Mail Wall)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-2 font-semibold text-muted-foreground">#</th>
                  <th className="text-left py-2 px-2 font-semibold text-muted-foreground">Email</th>
                  <th className="text-left py-2 px-2 font-semibold text-muted-foreground">Fonte</th>
                  <th className="text-left py-2 px-2 font-semibold text-muted-foreground">Data</th>
                  <th className="text-right py-2 px-2"></th>
                </tr>
              </thead>
              <tbody>
                {grantedEmails?.map((ge, index) => {
                  const sourceInfo = SOURCE_LABELS[ge.source || "gate_modal"] || SOURCE_LABELS.gate_modal;
                  const Icon = sourceInfo.icon;
                  return (
                    <tr key={ge.id} className="border-b border-border/50 hover:bg-muted/50">
                      <td className="py-2 px-2 text-muted-foreground">{index + 1}</td>
                      <td className="py-2 px-2 font-mono text-xs">{ge.email}</td>
                      <td className="py-2 px-2">
                        <Badge variant="secondary" className={`text-[10px] gap-1 ${sourceInfo.color}`}>
                          <Icon className="w-3 h-3" />
                          {sourceInfo.label}
                        </Badge>
                      </td>
                      <td className="py-2 px-2 text-xs text-muted-foreground">
                        {new Date(ge.created_at).toLocaleDateString("it-IT")}
                      </td>
                      <td className="py-2 px-2 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => removeGrantedEmail.mutate(ge.id)}
                          disabled={removeGrantedEmail.isPending}
                        >
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {grantedEmails?.length === 0 && (
              <p className="text-center py-6 text-xs text-muted-foreground italic">Nessuna email raccolta ancora.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Experience waitlist table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Waitlist Experience
          </CardTitle>
        </CardHeader>
        <CardContent>
          {waitlistLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-2 font-semibold text-muted-foreground">#</th>
                    <th className="text-left py-2 px-2 font-semibold text-muted-foreground">Email</th>
                    <th className="text-left py-2 px-2 font-semibold text-muted-foreground">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {waitlistEmails?.map((we, index) => (
                    <tr key={we.id} className="border-b border-border/50 hover:bg-muted/50">
                      <td className="py-2 px-2 text-muted-foreground">{index + 1}</td>
                      <td className="py-2 px-2 font-mono text-xs">{we.email}</td>
                      <td className="py-2 px-2 text-xs text-muted-foreground">
                        {new Date(we.created_at).toLocaleDateString("it-IT")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {waitlistEmails?.length === 0 && (
                <p className="text-center py-6 text-xs text-muted-foreground italic">Nessuna email nella waitlist.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsersTab;
