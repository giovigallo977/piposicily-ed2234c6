import { useEffect } from "react";
import SiteHeader from "@/components/SiteHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSiteContent } from "@/hooks/useSiteContent";
import { trackEvent } from "@/lib/trackEvent";

const AboutPage = () => {
  const { t } = useLanguage();
  useEffect(() => { trackEvent("page_view"); }, []);

  const { data } = useSiteContent("about_body");
  const body = data?.content || "";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="px-6 md:px-12 py-10 md:py-14 pb-24 max-w-3xl">
        <h2 className="font-sans uppercase tracking-widest text-[11px] md:text-xs text-foreground/60 mb-10">
          {t("navAbout")}
        </h2>
        <div className="font-sans text-sm md:text-base leading-relaxed text-foreground/80 whitespace-pre-line">
          {body}
        </div>
      </main>
    </div>
  );
};

export default AboutPage;
