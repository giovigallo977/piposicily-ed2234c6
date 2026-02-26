import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2, CheckCircle, Mail, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { user, sendMagicLink } = useAuth();
  const { language } = useLanguage();
  const queryClient = useQueryClient();

  const [email, setEmail] = useState("");
  const [processing, setProcessing] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [resending, setResending] = useState(false);

  const t = language === "it" ? {
    processingTitle: "Attivazione in corso…",
    successTitle: "Pagamento completato! ✅",
    successSubtitle: "Il tuo accesso premium è attivo.",
    checkEmail: "📩 Ti abbiamo inviato un link per accedere. Controlla la tua email.",
    spamHint: "Se non trovi l'email, controlla anche nella cartella spam.",
    resendBtn: "Invia di nuovo il link",
    resent: "Link inviato! Controlla la tua email.",
    noSession: "Sessione di pagamento non trovata.",
    cta: "Torna alla homepage",
    redirecting: "Reindirizzamento in corso…",
    error: "C'è stato un problema tecnico. Il tuo pagamento è registrato. Riprova tra qualche secondo.",
  } : {
    processingTitle: "Activating…",
    successTitle: "Payment complete! ✅",
    successSubtitle: "Your premium access is active.",
    checkEmail: "📩 We sent you a link to access your account. Check your email.",
    spamHint: "If you don't see the email, check your spam folder too.",
    resendBtn: "Send link again",
    resent: "Link sent! Check your email.",
    noSession: "Payment session not found.",
    cta: "Back to homepage",
    redirecting: "Redirecting…",
    error: "There was a technical issue. Your payment is registered. Please try again in a few seconds.",
  };

  // If user is already logged in and lands here, check premium and redirect
  useEffect(() => {
    if (!user) return;
    const checkAndRedirect = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("is_premium")
        .eq("user_id", user.id)
        .single();
      if (data?.is_premium) {
        await queryClient.invalidateQueries({ queryKey: ["premium-status"] });
        await queryClient.refetchQueries({ queryKey: ["premium-status"] });
        navigate("/", { replace: true });
      }
    };
    // Small delay for profile to be updated
    const timer = setTimeout(checkAndRedirect, 1500);
    return () => clearTimeout(timer);
  }, [user, navigate, queryClient]);

  // Main flow: call complete-purchase
  useEffect(() => {
    if (!sessionId || user) return;
    const activate = async () => {
      setProcessing(true);
      try {
        // Get email first
        const { data: emailData } = await supabase.functions.invoke("get-session-email", {
          body: { session_id: sessionId },
        });
        if (emailData?.email) setEmail(emailData.email);

        // Complete purchase (creates user + sends magic link)
        const { data, error } = await supabase.functions.invoke("complete-purchase", {
          body: { session_id: sessionId },
        });

        if (!error && data?.success) {
          if (data.email) setEmail(data.email);
        }
        // Always show completed — premium may be set even if OTP failed
        setCompleted(true);
      } catch {
        // Still show completed — don't block user with technical errors
        setCompleted(true);
      } finally {
        setProcessing(false);
      }
    };
    activate();
  }, [sessionId, user]);

  const handleResend = async () => {
    if (!email || resending) return;
    setResending(true);
    try {
      const { error } = await sendMagicLink(email);
      if (!error) {
        toast({ title: t.resent });
      }
    } catch {}
    setResending(false);
  };

  // Processing state
  if (processing && sessionId && !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">{t.processingTitle}</p>
        </div>
      </div>
    );
  }

  // Completed — show check email message
  if (completed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center max-w-sm space-y-6">
          <CheckCircle className="h-16 w-16 mx-auto" style={{ color: "hsl(var(--olive))" }} />
          <h1 className="text-2xl font-bold">{t.successTitle}</h1>
          <p className="text-muted-foreground">{t.successSubtitle}</p>
          <div className="bg-muted rounded-xl p-4 space-y-3">
            <Mail className="h-8 w-8 mx-auto text-muted-foreground" />
            <p className="text-sm">{t.checkEmail}</p>
            {email && (
              <p className="text-xs text-muted-foreground font-mono">{email}</p>
            )}
            <p className="text-xs text-muted-foreground italic">{t.spamHint}</p>
          </div>
          <Button
            onClick={handleResend}
            disabled={resending || !email}
            variant="outline"
            className="w-full"
          >
            {resending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
            {t.resendBtn}
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
          <Button onClick={() => navigate("/", { replace: true })} variant="outline" className="w-full">
            {t.cta}
          </Button>
        </div>
      </div>
    );
  }

  return null;
};

export default PaymentSuccess;
