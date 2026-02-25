import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePremiumStatus } from "@/hooks/usePremiumStatus";
import { Lock, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LoginModal = ({ open, onOpenChange }: LoginModalProps) => {
  const { signIn } = useAuth();
  const { language } = useLanguage();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const t = language === "it"
    ? {
        title: "Accedi",
        emailPlaceholder: "La tua email",
        passwordPlaceholder: "La tua password",
        loginBtn: "Accedi",
        loginError: "Errore nell'accesso",
        welcomeBack: "Bentornato! Accesso premium attivo.",
        welcomeGeneric: "Accesso effettuato.",
      }
    : {
        title: "Log in",
        emailPlaceholder: "Your email",
        passwordPlaceholder: "Your password",
        loginBtn: "Log in",
        loginError: "Login error",
        welcomeBack: "Welcome back! Premium access active.",
        welcomeGeneric: "Logged in successfully.",
      };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setLoading(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) resetForm();
    onOpenChange(isOpen);
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
      setTimeout(async () => {
        const { data: profile } = await supabase
          .from("profiles")
          .select("is_premium")
          .single();

        if (profile?.is_premium) {
          toast({ title: t.welcomeBack });
        } else {
          toast({ title: t.welcomeGeneric });
        }
        await queryClient.invalidateQueries({ queryKey: ["premium-status"] });
        handleOpenChange(false);
      }, 600);
    } catch {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">{t.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 pt-2">
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
            onKeyDown={(e) => {
              if (e.key === "Enter" && email && password && !loading) handleLogin();
            }}
          />
          <Button
            onClick={handleLogin}
            disabled={loading || !email || !password}
            className="w-full bg-foreground text-background hover:bg-foreground/90 font-semibold"
          >
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Lock className="w-4 h-4 mr-2" />}
            {t.loginBtn}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
