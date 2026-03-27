import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";

const emailSchema = z.string().trim().email().max(255);

interface ExperienceWaitlistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ExperienceWaitlistModal = ({ open, onOpenChange }: ExperienceWaitlistModalProps) => {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) return;

    setLoading(true);
    const { error } = await supabase
      .from("experience_waitlist")
      .insert({ email: parsed.data });

    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: t("experienceFakeDoorSuccess") });
    setEmail("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{t("experienceFakeDoorTitle")}</DialogTitle>
          <DialogDescription className="whitespace-pre-line text-base mt-2">
            {t("experienceFakeDoorDesc")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-2">
          <Input
            type="email"
            placeholder={t("experienceFakeDoorEmail")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            maxLength={255}
          />
          <Button type="submit" disabled={loading} className="w-full font-bold" style={{ backgroundColor: 'hsl(var(--cta-yellow))', color: 'hsl(var(--cta-yellow-foreground))' }}>
            {t("experienceFakeDoorCta")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ExperienceWaitlistModal;
