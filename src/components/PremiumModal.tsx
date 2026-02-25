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

type ModalView = "choice" | "login" | "signup";

const PremiumModal = ({ open, onOpenChange }: PremiumModalProps) => {
  const { user, signUp, signIn } = useAuth();
  const { language } = useLanguage();
  const queryClient = useQueryClient();
  const [view, setView] = useState<ModalView>("choice");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const t = language === "it" ? {
    title: "Sblocca Pipo Premium",
    subtitle: "Accesso completo a tutti gli hotspot",
    benefit1: "Tutte le schede sbloccate per sempre",
    benefit2: "Nessun abbonamento, paghi una volta sola",
    benefit3: "Aggiornamenti futuri inclusi",
    price: "€4.99",
    priceLabel: "una tantum",
    loginBtn: "Sei già registrato? Accedi con le tue credenziali",
    signupBtn: "Sblocca tutti gli hotspot per sempre a €4.99",
    payButton: "Paga €4.99 e sblocca tutto",
    emailPlaceholder: "La tua email",
    passwordPlaceholder: "La tua password",
    confirmPasswordPlaceholder: "Conferma password",
    signupLabel: "Crea account e paga €4.99",
    loginLabel: "Accedi",
    back: "← Torna indietro",
    signupError: "Errore nella registrazione",
    loginError: "Errore nell'accesso",
    checkEmail: "Controlla la tua email per confermare la registrazione",
    paymentError: "Errore nell'avvio del pagamento",
    welcomeBack: "Bentornato! Accesso premium attivo.",
    passwordMismatch: "Le password non corrispondono",
  } : {
    title: "Unlock Pipo Premium",
    subtitle: "Full access to all hotspots",
    benefit1: "All cards unlocked forever",
    benefit2: "No subscription, pay once",
    benefit3: "Future updates included",
    price: "€4.99",
    priceLabel: "one-time",
    loginBtn: "Already registered? Log in with your credentials",
    signupBtn: "Unlock all hotspots forever for €4.99",
    payButton: "Pay €4.99 and unlock all",
    emailPlaceholder: "Your email",
    passwordPlaceholder: "Your password",
    confirmPasswordPlaceholder: "Confirm password",
    signupLabel: "Create account & pay €4.99",
    loginLabel: "Log in",
    back: "← Go back",
    signupError: "Registration error",
    loginError: "Login error",
    checkEmail: "Check your email to confirm registration",
    paymentError: "Error starting payment",
    welcomeBack: "Welcome back! Premium access active.",
    passwordMismatch: "Passwords don't match",
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setView("choice");
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

  const checkPremiumAndAct = async (): Promise<boolean> => {
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_premium")
      .single();

    if (profile?.is_premium) {
      toast({ title: t.welcomeBack });
      await queryClient.invalidateQueries({ queryKey: ["premium-status"] });
      handleOpenChange(false);
      return true;
    }
    return false;
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) {
        toast({ title: t.loginError, description: error.message, variant: "destructive" });
        return;
      }
      // Wait for session, then check premium
      setTimeout(async () => {
        const alreadyPremium = await checkPremiumAndAct();
        if (!alreadyPremium) {
          setLoading(false);
          // User is now logged in but not premium — UI will re-render to show pay button
        }
      }, 600);
    } catch {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      toast({ title: t.passwordMismatch, variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { error } = await signUp(email, password);
      if (error) {
        toast({ title: t.signupError, description: error.message, variant: "destructive" });
        return;
      }
      // Try auto-login and redirect to Stripe
      const { error: loginError } = await signIn(email, password);
      if (loginError) {
        // Email confirmation likely required
        toast({ title: t.checkEmail });
        return;
      }
      // Auto-login succeeded, redirect to payment
      const { data, error: payError } = await supabase.functions.invoke("create-payment");
      if (payError) throw payError;
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
    } catch (error: any) {
      toast({ title: t.paymentError, description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const benefits = [t.benefit1, t.benefit2, t.benefit3];

  // Header + benefits + price (shared across all views)
  const renderHeader = () => (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-xl">
          <Sparkles className="w-5 h-5 text-primary" />
          {t.title}
        </DialogTitle>
      </DialogHeader>
      <p className="text-sm text-muted-foreground">{t.subtitle}</p>
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
    </>
  );

  const renderBackButton = () => (
    <button
      onClick={() => { setView("choice"); setLoading(false); }}
      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
    >
      <ArrowLeft className="w-3 h-3" />
      {t.back}
    </button>
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        {renderHeader()}

        {/* Already authenticated → show pay button directly */}
        {user ? (
          <Button onClick={handlePay} disabled={loading} className="w-full bg-foreground text-background hover:bg-foreground/90 font-semibold">
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Lock className="w-4 h-4 mr-2" />}
            {t.payButton}
          </Button>
        ) : view === "choice" ? (
          /* Choice view: two clear buttons */
          <div className="space-y-3">
            <Button
              onClick={() => setView("signup")}
              className="w-full bg-foreground text-background hover:bg-foreground/90 font-semibold"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {t.signupBtn}
            </Button>
            <Button
              variant="outline"
              onClick={() => setView("login")}
              className="w-full font-semibold"
            >
              {t.loginBtn}
            </Button>
          </div>
        ) : view === "login" ? (
          /* Login view */
          <div className="space-y-3">
            {renderBackButton()}
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
        ) : (
          /* Signup view */
          <div className="space-y-3">
            {renderBackButton()}
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
            <Input
              type="password"
              placeholder={t.confirmPasswordPlaceholder}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button
              onClick={handleSignup}
              disabled={loading || !email || !password || !confirmPassword}
              className="w-full bg-foreground text-background hover:bg-foreground/90 font-semibold"
            >
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
              {t.signupLabel}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PremiumModal;
