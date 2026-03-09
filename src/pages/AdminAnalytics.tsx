import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Eye, MousePointerClick, CreditCard, ArrowLeft, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Counts {
  page_view: number;
  hotspot_view: number;
  payment_click: number;
}

const AdminAnalytics = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [counts, setCounts] = useState<Counts>({ page_view: 0, hotspot_view: 0, payment_click: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchCounts = async () => {
      const { data, error } = await supabase.rpc("get_analytics_counts");
      if (error || !data) {
        setLoading(false);
        return;
      }
      const result: Counts = { page_view: 0, hotspot_view: 0, payment_click: 0 };
      (data as { event_type: string; count: number }[]).forEach((row) => {
        if (row.event_type in result) {
          result[row.event_type as keyof Counts] = Number(row.count);
        }
      });
      setCounts(result);
      setLoading(false);
    };
    fetchCounts();
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const cards = [
    { label: "Page Views", value: counts.page_view, icon: Eye, color: "text-blue-500" },
    { label: "Hotspot Views", value: counts.hotspot_view, icon: MousePointerClick, color: "text-emerald-500" },
    { label: "Payment Clicks", value: counts.payment_click, icon: CreditCard, color: "text-amber-500" },
  ];

  return (
    <div className="min-h-screen bg-background p-6 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
      </div>

      <div className="grid gap-4">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{c.label}</CardTitle>
              <c.icon className={`w-5 h-5 ${c.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{c.value.toLocaleString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminAnalytics;
