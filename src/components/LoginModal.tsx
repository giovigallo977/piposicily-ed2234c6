import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { Mail, Loader2, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LoginModal = ({ open, onOpenChange }: LoginModalProps) => {
  const { sendMagicLink } = useAuth();
  const { language } = useLanguage();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const t = language === "it"
    ? {
        title: "Accedi",
        emailPlaceholder: "La tua email",
        sendBtn: "Invia link di accesso",
        sent: "Controlla la tua email per accedere",
        sentDesc: "Ti abbiamo inviato un link magico.",
        error: "Errore nell'invio del link",
      }
    : {
        title: "Log in",
        emailPlaceholder: "Your email",
        sendBtn: "Send access link",
        sent: "Check your email to log in",
        sentDesc: "We sent you a magic link.",
        error: "Error sending link",
      };

  const resetForm = () => {
    setEmail("");
    setLoading(false);
    setSent(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) resetForm();
    onOpenChange(isOpen);
  };

  const handleSend = async () => {
    setLoading(true);
    try {
      const { error } = await sendMagicLink(email);
      if (error) {
        toast({ title: t.error, description: error.message, variant: "destructive" });
        setLoading(false);
        return;
      }
      setSent(true);
    } catch {
      toast({ title: t.error, variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">{t.title}</DialogTitle>
        </DialogHeader>
        {sent ? (
          <div className="text-center space-y-4 py-4">
            <CheckCircle className="w-10 h-10 mx-auto" style={{ color: "hsl(var(--olive))" }} />
            <p className="font-semibold">{t.sent}</p>
            <p className="text-sm text-muted-foreground">{t.sentDesc}</p>
            {email && <p className="text-xs text-muted-foreground font-mono">{email}</p>}
          </div>
        ) : (
          <div className="space-y-3 pt-2">
            <Input
              type="email"
              placeholder={t.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && email && !loading) handleSend();
              }}
            />
            <Button
              onClick={handleSend}
              disabled={loading || !email}
              className="w-full bg-foreground text-background hover:bg-foreground/90 font-semibold"
            >
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Mail className="w-4 h-4 mr-2" />}
              {t.sendBtn}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
