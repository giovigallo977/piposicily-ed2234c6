import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language } = useLanguage();
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);

  const texts = language === "it" ? {
    verifying: "Verifica pagamento in corso…",
    title: "Pagamento completato!",
    subtitle: "Ora hai accesso a tutti gli hotspot di Pipo. Buona esplorazione! 🛸",
    cta: "Inizia ad esplorare",
    error: "Errore nella verifica. Riprova tra qualche minuto.",
  } : {
    verifying: "Verifying payment…",
    title: "Payment complete!",
    subtitle: "You now have access to all Pipo hotspots. Happy exploring! 🛸",
    cta: "Start exploring",
    error: "Verification error. Please try again in a few minutes.",
  };

  useEffect(() => {
    const verify = async () => {
      if (!user) {
        // User not authenticated — wait a bit for session to restore
        await new Promise(r => setTimeout(r, 3000));
      }
      // Re-check user from auth state
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        // Still no user — show generic success and let them navigate
        setSuccess(true);
        setVerifying(false);
        return;
      }
      try {
        const { data, error } = await supabase.functions.invoke("verify-payment");
        if (!error && data?.isPremium) {
          setSuccess(true);
        }
      } catch {}
      setVerifying(false);
    };
    // Small delay to let Stripe process
    const timer = setTimeout(verify, 2000);
    return () => clearTimeout(timer);
  }, [user]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="text-center max-w-sm space-y-6">
        {verifying ? (
          <>
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">{texts.verifying}</p>
          </>
        ) : success ? (
          <>
            <CheckCircle className="h-16 w-16 text-olive mx-auto" style={{ color: "hsl(var(--olive))" }} />
            <h1 className="text-2xl font-bold">{texts.title}</h1>
            <p className="text-muted-foreground">{texts.subtitle}</p>
            <Button onClick={() => navigate("/esplora")} className="w-full bg-foreground text-background hover:bg-foreground/90 font-semibold">
              {texts.cta}
            </Button>
          </>
        ) : (
          <>
            <p className="text-muted-foreground">{texts.error}</p>
            <Button onClick={() => navigate("/esplora")} variant="outline" className="w-full">
              {texts.cta}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
