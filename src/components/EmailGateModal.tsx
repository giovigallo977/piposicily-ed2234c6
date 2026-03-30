import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { trackEvent } from "@/lib/trackEvent";
import { z } from "zod";

const emailSchema = z.string().trim().email().max(255);

interface EmailGateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEmailProvided?: () => void;
}

const EmailGateModal = ({ open, onOpenChange, onEmailProvided }: EmailGateModalProps) => {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"email" | "location">("email");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) return;

    setLoading(true);
    try {
      // Save email to granted_emails
      await supabase.from("granted_emails").insert({ email: parsed.data });
      gtag("event", "email_submit", { label: "gate_modal" });
      trackEvent("email_inserita");
      setStep("location");
    } catch (err: any) {
      toast({ title: err.message || "Error", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleLocationChoice = (location: string) => {
    // Fire and forget
    gtag("event", "user_location", { label: location });
    finishAndClose();
  };

  const handleSkipLocation = () => {
    finishAndClose();
  };

  const finishAndClose = () => {
    onEmailProvided?.();
    setStep("email");
    setEmail("");
  };

  const handleClose = (val: boolean) => {
    // Don't allow closing unless unlocked (force email)
    if (!val && step === "email") return;
    if (!val && step === "location") {
      finishAndClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-md text-center px-6 py-8"
        onInteractOutside={(e) => { if (step === "email") e.preventDefault(); }}
      >
        {step === "email" ? (
          <>
            <p className="text-3xl mb-2">🧭</p>
            <h2 className="font-sans text-xl font-bold text-foreground">
              {t("gateTitle")}
            </h2>
            <p className="text-sm text-muted-foreground mt-2 mb-6 whitespace-pre-line">
              {t("gateDesc")}
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <Input
                type="email"
                placeholder={t("gateEmailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                maxLength={255}
              />
              <Button type="submit" disabled={loading} className="w-full font-bold">
                {loading ? "..." : t("gateCta")}
              </Button>
            </form>
          </>
        ) : (
          <>
            <p className="text-3xl mb-2">📍</p>
            <h2 className="font-sans text-xl font-bold text-foreground">
              {t("gateLocationTitle")}
            </h2>
            <div className="flex flex-col gap-2 mt-4">
              {["Palermo", "Sicilia", t("gateLocationOther")].map((loc) => (
                <Button
                  key={loc}
                  variant="outline"
                  className="w-full"
                  onClick={() => handleLocationChoice(loc)}
                >
                  {loc}
                </Button>
              ))}
            </div>
            <button
              onClick={handleSkipLocation}
              className="mt-3 text-xs text-muted-foreground hover:underline"
            >
              {t("gateSkip")}
            </button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EmailGateModal;
