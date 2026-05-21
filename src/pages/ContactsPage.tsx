import { useEffect } from "react";
import SiteHeader from "@/components/SiteHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSiteContent } from "@/hooks/useSiteContent";
import { trackEvent } from "@/lib/trackEvent";

const ContactsPage = () => {
  const { t } = useLanguage();
  useEffect(() => { trackEvent("page_view"); }, []);

  const { data: bodyContent } = useSiteContent("contacts_body");
  const { data: igUrlContent } = useSiteContent("contacts_ig_url");
  const { data: igLabelContent } = useSiteContent("contacts_ig_label");
  const { data: emailContent } = useSiteContent("contacts_email");

  const body = bodyContent?.content?.trim() || "";
  const igUrl = igUrlContent?.content?.trim() || "https://instagram.com/pipo.fuoriradar";
  const igLabel = igLabelContent?.content?.trim() || t("contactsIg");
  const email = emailContent?.content?.trim() || "pipoesplora@gmail.com";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="px-6 md:px-12 py-10 md:py-14 pb-24 max-w-3xl">
        <h2 className="font-sans uppercase tracking-widest text-[11px] md:text-xs text-foreground/60 mb-10">
          {t("contactsTitle")}
        </h2>

        {body && (
          <p className="font-sans text-sm md:text-base leading-relaxed text-foreground/80 whitespace-pre-line mb-10">
            {body}
          </p>
        )}

        <div className="space-y-4 font-sans text-sm md:text-base">
          <a
            href={igUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-foreground border-b border-foreground/20 hover:border-foreground pb-1 w-fit transition"
          >
            {igLabel}
          </a>
          <a
            href={`mailto:${email}`}
            className="block text-foreground border-b border-foreground/20 hover:border-foreground pb-1 w-fit transition"
          >
            {email}
          </a>
        </div>
      </main>
    </div>
  );
};

export default ContactsPage;
