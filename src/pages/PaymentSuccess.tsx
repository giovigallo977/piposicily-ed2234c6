import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2, CheckCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { user, signIn } = useAuth();
  const { language } = useLanguage();
  const queryClient = useQueryClient();

  const [email, setEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [verifyingExisting, setVerifyingExisting] = useState(!!user);

  const t = language === "it" ? {
    title: "Pagamento completato! ✅",
    subtitle: "Il tuo accesso premium è quasi pronto.\nCrea una password per attivare il tuo account.",
    emailLabel: "Email",
    passwordPlaceholder: "Crea una password",
    confirmPlaceholder: "Conferma password",
    submitBtn: "Attiva il mio accesso",
    mismatch: "Le password non corrispondono",
    tooShort: "La password deve avere almeno 6 caratteri",
    error: "Errore nell'attivazione. Riprova.",
    successToast: "Accesso Premium attivo",
    cta: "Inizia ad esplorare",
    verifying: "Verifica pagamento in corso…",
    noSession: "Sessione di pagamento non trovata.",
  } : {
    title: "Payment complete! ✅",
    subtitle: "Your premium access is almost ready.\nCreate a password to activate your account.",
    emailLabel: "Email",
    passwordPlaceholder: "Create a password",
    confirmPlaceholder: "Confirm password",
    submitBtn: "Activate my access",
    mismatch: "Passwords don't match",
    tooShort: "Password must be at least 6 characters",
    error: "Activation error. Please try again.",
    successToast: "Premium access active",
    cta: "Start exploring",
    verifying: "Verifying payment…",
    noSession: "Payment session not found.",
  };

  // Fetch email from Stripe session
  useEffect(() => {
    if (!sessionId || user) return;
    const fetchEmail = async () => {
      setEmailLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke("get-session-email", {
          body: { session_id: sessionId },
        });
        if (!error && data?.email) setEmail(data.email);
      } catch {}
      setEmailLoading(false);
    };
    fetchEmail();
  }, [sessionId, user]);

  // If user is already authenticated, just verify payment
  useEffect(() => {
    if (!user || !verifyingExisting) return;
    const verify = async () => {
      try {
        const { data } = await supabase.functions.invoke("verify-payment");
        if (data?.isPremium) {
          await queryClient.invalidateQueries({ queryKey: ["premium-status"] });
          setCompleted(true);
        }
      } catch {}
      setVerifyingExisting(false);
    };
    const timer = setTimeout(verify, 2000);
    return () => clearTimeout(timer);
  }, [user]);

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      toast({ title: t.mismatch, variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: t.tooShort, variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("complete-purchase", {
        body: { session_id: sessionId, password },
      });
      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || "Unknown error");

      // Auto-login
      const { error: loginError } = await signIn(data.email, password);
      if (loginError) throw loginError;

      await queryClient.invalidateQueries({ queryKey: ["premium-status"] });
      toast({ title: t.successToast });
      setCompleted(true);
    } catch (error: any) {
      toast({ title: t.error, description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // Already logged in user — verifying
  if (verifyingExisting) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">{t.verifying}</p>
        </div>
      </div>
    );
  }

  // Completed — redirect to home
  if (completed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center max-w-sm space-y-6">
          <CheckCircle className="h-16 w-16 mx-auto" style={{ color: "hsl(var(--olive))" }} />
          <h1 className="text-2xl font-bold">{t.successToast}</h1>
          <Button
            onClick={() => navigate("/")}
            className="w-full bg-foreground text-background hover:bg-foreground/90 font-semibold"
          >
            {t.cta}
          </Button>
        </div>
      </div>
    );
  }

  // No session_id
  if (!sessionId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center max-w-sm space-y-6">
          <p className="text-muted-foreground">{t.noSession}</p>
          <Button onClick={() => navigate("/")} variant="outline" className="w-full">
            {t.cta}
          </Button>
        </div>
      </div>
    );
  }

  // Main view — create password
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <CheckCircle className="h-14 w-14 mx-auto" style={{ color: "hsl(var(--olive))" }} />
          <h1 className="text-2xl font-bold">{t.title}</h1>
          <p className="text-sm text-muted-foreground whitespace-pre-line">{t.subtitle}</p>
        </div>

        <div className="space-y-3">
          {/* Email read-only */}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">{t.emailLabel}</label>
            <Input
              type="email"
              value={email}
              disabled
              className="bg-muted"
              placeholder={emailLoading ? "..." : ""}
            />
          </div>
          <Input
            type="password"
            placeholder={t.passwordPlaceholder}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            type="password"
            placeholder={t.confirmPlaceholder}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button
            onClick={handleSubmit}
            disabled={loading || !password || !confirmPassword || !email}
            className="w-full bg-foreground text-background hover:bg-foreground/90 font-semibold py-6 text-base"
          >
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Lock className="w-4 h-4 mr-2" />}
            {t.submitBtn}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
