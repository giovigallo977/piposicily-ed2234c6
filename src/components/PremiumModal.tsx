import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { Lock, Check, Sparkles, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PremiumModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PremiumModal = ({ open, onOpenChange }: PremiumModalProps) => {
  const { user, signUp, signIn } = useAuth();
  const { language } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);

  const texts = language === "it" ? {
    title: "Sblocca Pipo Premium",
    subtitle: "Accesso completo a tutti gli hotspot",
    benefit1: "Tutte le schede sbloccate per sempre",
    benefit2: "Nessun abbonamento, paghi una volta sola",
    benefit3: "Aggiornamenti futuri inclusi",
    price: "€4.99",
    priceLabel: "una tantum",
    payButton: "Paga €4.99 e sblocca tutto",
    emailPlaceholder: "La tua email",
    passwordPlaceholder: "Scegli una password",
    signupLabel: "Crea account e paga",
    loginLabel: "Accedi e paga",
    switchToLogin: "Hai già un account? Accedi",
    switchToSignup: "Non hai un account? Registrati",
    signupError: "Errore nella registrazione",
    loginError: "Errore nell'accesso",
    checkEmail: "Controlla la tua email per confermare la registrazione",
    paymentError: "Errore nell'avvio del pagamento",
  } : {
    title: "Unlock Pipo Premium",
    subtitle: "Full access to all hotspots",
    benefit1: "All cards unlocked forever",
    benefit2: "No subscription, pay once",
    benefit3: "Future updates included",
    price: "€4.99",
    priceLabel: "one-time",
    payButton: "Pay €4.99 and unlock all",
    emailPlaceholder: "Your email",
    passwordPlaceholder: "Choose a password",
    signupLabel: "Create account & pay",
    loginLabel: "Login & pay",
    switchToLogin: "Already have an account? Login",
    switchToSignup: "Don't have an account? Sign up",
    signupError: "Registration error",
    loginError: "Login error",
    checkEmail: "Check your email to confirm registration",
    paymentError: "Error starting payment",
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
      toast({ title: texts.paymentError, description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async () => {
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast({ title: texts.loginError, description: error.message, variant: "destructive" });
          return;
        }
        // After login, start payment
        setTimeout(handlePay, 500);
      } else {
        const { error } = await signUp(email, password);
        if (error) {
          toast({ title: texts.signupError, description: error.message, variant: "destructive" });
          return;
        }
        toast({ title: texts.checkEmail });
      }
    } finally {
      setLoading(false);
    }
  };

  const benefits = [texts.benefit1, texts.benefit2, texts.benefit3];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="w-5 h-5 text-primary" />
            {texts.title}
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">{texts.subtitle}</p>

        <ul className="space-y-2 my-2">
          {benefits.map((b, i) => (
            <li key={i} className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4 flex-shrink-0" style={{ color: "hsl(var(--olive))" }} />
              {b}
            </li>
          ))}
        </ul>

        <div className="text-center py-3 rounded-xl bg-muted">
          <span className="text-3xl font-bold">{texts.price}</span>
          <span className="text-sm text-muted-foreground ml-2">{texts.priceLabel}</span>
        </div>

        {user ? (
          <Button onClick={handlePay} disabled={loading} className="w-full bg-foreground text-background hover:bg-foreground/90 font-semibold">
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Lock className="w-4 h-4 mr-2" />}
            {texts.payButton}
          </Button>
        ) : (
          <div className="space-y-3">
            <Input
              type="email"
              placeholder={texts.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder={texts.passwordPlaceholder}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              onClick={handleAuth}
              disabled={loading || !email || !password}
              className="w-full bg-foreground text-background hover:bg-foreground/90 font-semibold"
            >
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Lock className="w-4 h-4 mr-2" />}
              {isLogin ? texts.loginLabel : texts.signupLabel}
            </Button>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="w-full text-xs text-muted-foreground underline"
            >
              {isLogin ? texts.switchToSignup : texts.switchToLogin}
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PremiumModal;
