import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { Lock, Check, Sparkles, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface PremiumModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ModalView = "main" | "login";

const PremiumModal = ({ open, onOpenChange }: PremiumModalProps) => {
  const { user, signIn } = useAuth();
  const { language } = useLanguage();
  const queryClient = useQueryClient();
  const [view, setView] = useState<ModalView>("main");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const t = language === "it" ? {
    title: "Sblocca tutti gli hotspot",
    subtitle: "Accesso completo a tutte le mappe Pipo.\nPagamento unico 4,99€ – accesso per sempre.",
    benefit1: "Tutte le schede sbloccate per sempre",
    benefit2: "Nessun abbonamento, paghi una volta sola",
    benefit3: "Aggiornamenti futuri inclusi",
    price: "€4.99",
    priceLabel: "una tantum",
    unlockBtn: "Sblocca tutto – €4.99",
    loginLink: "Hai già pagato? Accedi",
    loginLabel: "Accedi",
    emailPlaceholder: "La tua email",
    passwordPlaceholder: "La tua password",
    back: "← Torna indietro",
    loginError: "Errore nell'accesso",
    paymentError: "Errore nell'avvio del pagamento",
    welcomeBack: "Bentornato! Accesso premium attivo.",
  } : {
    title: "Unlock all hotspots",
    subtitle: "Full access to all Pipo maps.\nOne-time payment €4.99 – access forever.",
    benefit1: "All cards unlocked forever",
    benefit2: "No subscription, pay once",
    benefit3: "Future updates included",
    price: "€4.99",
    priceLabel: "one-time",
    unlockBtn: "Unlock all – €4.99",
    loginLink: "Already paid? Log in",
    loginLabel: "Log in",
    emailPlaceholder: "Your email",
    passwordPlaceholder: "Your password",
    back: "← Go back",
    loginError: "Login error",
    paymentError: "Error starting payment",
    welcomeBack: "Welcome back! Premium access active.",
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setView("main");
    setLoading(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) resetForm();
    onOpenChange(isOpen);
  };

  const handlePay = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-payment");
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      toast({ title: t.paymentError, description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) {
        toast({ title: t.loginError, description: error.message, variant: "destructive" });
        setLoading(false);
        return;
      }
      // Wait for session, then check premium
      setTimeout(async () => {
        const { data: profile } = await supabase
          .from("profiles")
          .select("is_premium")
          .single();

        if (profile?.is_premium) {
          toast({ title: t.welcomeBack });
          await queryClient.invalidateQueries({ queryKey: ["premium-status"] });
          handleOpenChange(false);
        } else {
          // Logged in but not premium — show pay button
          setLoading(false);
        }
      }, 600);
    } catch {
      setLoading(false);
    }
  };

  const benefits = [t.benefit1, t.benefit2, t.benefit3];

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="w-5 h-5 text-primary" />
            {t.title}
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground whitespace-pre-line">{t.subtitle}</p>
        <ul className="space-y-2 my-2">
          {benefits.map((b, i) => (
            <li key={i} className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4 flex-shrink-0" style={{ color: "hsl(var(--olive))" }} />
              {b}
            </li>
          ))}
        </ul>
        <div className="text-center py-3 rounded-xl bg-muted">
          <span className="text-3xl font-bold">{t.price}</span>
          <span className="text-sm text-muted-foreground ml-2">{t.priceLabel}</span>
        </div>

        {view === "main" ? (
          <div className="space-y-3">
            <Button
              onClick={handlePay}
              disabled={loading}
              className="w-full bg-foreground text-background hover:bg-foreground/90 font-semibold text-base py-6"
            >
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Lock className="w-4 h-4 mr-2" />}
              {t.unlockBtn}
            </Button>
            {!user && (
              <button
                onClick={() => setView("login")}
                className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
              >
                {t.loginLink}
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <button
              onClick={() => { setView("main"); setLoading(false); }}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-3 h-3" />
              {t.back}
            </button>
            <Input
              type="email"
              placeholder={t.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder={t.passwordPlaceholder}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              onClick={handleLogin}
              disabled={loading || !email || !password}
              className="w-full bg-foreground text-background hover:bg-foreground/90 font-semibold"
            >
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Lock className="w-4 h-4 mr-2" />}
              {t.loginLabel}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PremiumModal;
