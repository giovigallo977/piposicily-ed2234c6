import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface EmailGateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EmailGateModal = ({ open, onOpenChange }: EmailGateModalProps) => {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: true },
      });
      if (error) throw error;
      setSent(true);
    } catch (err: any) {
      toast({ title: err.message || "Error", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = (val: boolean) => {
    if (!val) {
      setSent(false);
      setEmail("");
    }
    onOpenChange(val);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md text-center px-6 py-8">
        {!sent ? (
          <>
            <p className="text-3xl mb-2">😎</p>
            <h2 className="font-sans text-xl font-bold text-foreground">
              {t("gateTitle")}
            </h2>
            <p className="text-sm text-muted-foreground mt-2 mb-6">
              {t("gateDesc")}
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <Input
                type="email"
                placeholder={t("gateEmailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" disabled={loading} className="w-full font-bold">
                {loading ? "..." : t("gateCta")}
              </Button>
            </form>
          </>
        ) : (
          <>
            <p className="text-3xl mb-2">📬</p>
            <h2 className="font-sans text-xl font-bold text-foreground">
              {t("gateSentTitle")}
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              {t("gateSentDesc")}
            </p>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EmailGateModal;
