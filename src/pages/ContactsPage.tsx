import { useEffect } from "react";
import SiteHeader from "@/components/SiteHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import { trackEvent } from "@/lib/trackEvent";

const ContactsPage = () => {
  const { t } = useLanguage();
  useEffect(() => { trackEvent("page_view", { page: "contacts" }); }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="px-6 md:px-12 py-10 md:py-14 pb-24 max-w-3xl">
        <h2 className="font-sans uppercase tracking-widest text-[11px] md:text-xs text-foreground/60 mb-10">
          {t("contactsTitle")}
        </h2>
        <div className="space-y-4 font-sans text-sm md:text-base">
          <a
            href="https://instagram.com/pipo.fuoriradar"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-foreground border-b border-foreground/20 hover:border-foreground pb-1 w-fit transition"
          >
            {t("contactsIg")}
          </a>
          <a
            href="mailto:pipoesplora@gmail.com"
            className="block text-foreground border-b border-foreground/20 hover:border-foreground pb-1 w-fit transition"
          >
            {t("contactsEmail")}
          </a>
        </div>
      </main>
    </div>
  );
};

export default ContactsPage;
