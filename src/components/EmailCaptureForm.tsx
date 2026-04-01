import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { trackEvent } from "@/lib/trackEvent";
import { z } from "zod";

const emailSchema = z.string().trim().email().max(255);

interface EmailCaptureFormProps {
  source: "self_guided" | "experience";
  ctaText: string;
  microcopy: string;
  placeholder?: string;
}

const EmailCaptureForm = ({ source, ctaText, microcopy, placeholder = "Inserisci la tua email" }: EmailCaptureFormProps) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      toast({ title: "Inserisci un'email valida", variant: "destructive" });
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from("experience_waitlist")
      .insert({ email: parsed.data, source });

    setLoading(false);
    if (error) {
      if (error.code === "23505") {
        toast({ title: "Email già registrata! Ti avviseremo presto 🎉" });
        setSubmitted(true);
      } else {
        toast({ title: "Errore", description: error.message, variant: "destructive" });
      }
      return;
    }

    trackEvent("email_inserita");
    gtag("event", "email_submit", { label: source });
    toast({ title: "Perfetto! Ti avviseremo presto 🎉" });
    setEmail("");
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-6">
        <p className="text-xl font-bold text-foreground">Sei dentro! 🎉</p>
        <p className="text-muted-foreground mt-2">Ti avviseremo appena sarà tutto pronto.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full max-w-md mx-auto">
      <Input
        type="email"
        placeholder={placeholder}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        maxLength={255}
        className="h-12 text-base"
      />
      <Button
        type="submit"
        disabled={loading}
        className="h-12 text-base font-bold w-full"
        style={{ backgroundColor: "hsl(var(--cta-yellow))", color: "hsl(var(--cta-yellow-foreground))" }}
      >
        👉 {ctaText}
      </Button>
      <p className="text-sm text-muted-foreground text-center">{microcopy}</p>
    </form>
  );
};

export default EmailCaptureForm;
