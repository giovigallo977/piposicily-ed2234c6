import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePremiumStatus } from "@/hooks/usePremiumStatus";
import { Lock, Check, Sparkles, Loader2, Mail, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/trackEvent";

interface PremiumModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ModalView = "main" | "login";

const PremiumModal = ({ open, onOpenChange }: PremiumModalProps) => {
  const { user, sendMagicLink } = useAuth();
  const { language } = useLanguage();
  const { isPremium } = usePremiumStatus();
  const [view, setView] = useState<ModalView>("main");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [linkSent, setLinkSent] = useState(false);

  const t = language === "it" ? {
    title: "Sblocca tutte le mappe Pipo",
    subtitle: "Accesso completo a tutti gli hotspot.\nPagamento unico. Per sempre.",
    benefit1: "Tutte le schede sbloccate per sempre",
    benefit2: "Nessun abbonamento, paghi una volta sola",
    benefit3: "Aggiornamenti futuri inclusi",
    price: "€4.99",
    priceLabel: "una tantum",
    unlockBtn: "Sblocca tutto – €4.99",
    loginLink: "Hai già pagato? Accedi",
    loginLabel: "Accedi",
    emailPlaceholder: "La tua email",
    sendBtn: "Invia link di accesso",
    linkSent: "Controlla la tua email per accedere",
    linkSentDesc: "Ti abbiamo inviato un link magico.",
    loginError: "Errore nell'invio del link",
    paymentError: "Errore nell'avvio del pagamento",
    alreadyPremiumTitle: "Sei già Premium ✨",
    alreadyPremiumText: "Tutti gli hotspot sono sbloccati.",
    close: "Chiudi",
  } : {
    title: "Unlock all Pipo maps",
    subtitle: "Full access to all hotspots.\nOne-time payment. Forever.",
    benefit1: "All cards unlocked forever",
    benefit2: "No subscription, pay once",
    benefit3: "Future updates included",
    price: "€4.99",
    priceLabel: "one-time",
    unlockBtn: "Unlock all – €4.99",
    loginLink: "Already paid? Log in",
    loginLabel: "Log in",
    emailPlaceholder: "Your email",
    sendBtn: "Send access link",
    linkSent: "Check your email to log in",
    linkSentDesc: "We sent you a magic link.",
    loginError: "Error sending link",
    paymentError: "Error starting payment",
    alreadyPremiumTitle: "You're already Premium ✨",
    alreadyPremiumText: "All hotspots are unlocked.",
    close: "Close",
  };

  const resetForm = () => {
    setEmail("");
    setView("main");
    setLoading(false);
    setLinkSent(false);
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

  const handleSendLink = async () => {
    setLoading(true);
    try {
      const { error } = await sendMagicLink(email);
      if (error) {
        toast({ title: t.loginError, description: error.message, variant: "destructive" });
        setLoading(false);
        return;
      }
      setLinkSent(true);
    } catch {
      toast({ title: t.loginError, variant: "destructive" });
    }
    setLoading(false);
  };

  const benefits = [t.benefit1, t.benefit2, t.benefit3];

  // Premium guard
  if (isPremium && user) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center space-y-4 py-4">
            <Sparkles className="w-10 h-10 text-olive mx-auto" />
            <h2 className="text-xl font-bold">{t.alreadyPremiumTitle}</h2>
            <p className="text-muted-foreground">{t.alreadyPremiumText}</p>
            <Button onClick={() => handleOpenChange(false)} variant="outline" className="w-full">
              {t.close}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        {view === "main" ? (
          <>
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
          </>
        ) : linkSent ? (
          <div className="text-center space-y-4 py-4">
            <CheckCircle className="w-10 h-10 mx-auto" style={{ color: "hsl(var(--olive))" }} />
            <p className="font-semibold">{t.linkSent}</p>
            <p className="text-sm text-muted-foreground">{t.linkSentDesc}</p>
            {email && <p className="text-xs text-muted-foreground font-mono">{email}</p>}
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">{t.loginLabel}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 pt-2">
              <Input
                type="email"
                placeholder={t.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && email && !loading) handleSendLink();
                }}
              />
              <Button
                onClick={handleSendLink}
                disabled={loading || !email}
                className="w-full bg-foreground text-background hover:bg-foreground/90 font-semibold"
              >
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Mail className="w-4 h-4 mr-2" />}
                {t.sendBtn}
              </Button>
              <button
                onClick={() => { setView("main"); setLoading(false); }}
                className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
              >
                {language === "it" ? "Sblocca tutti gli hotspot a €4.99 →" : "Unlock all hotspots for €4.99 →"}
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PremiumModal;
