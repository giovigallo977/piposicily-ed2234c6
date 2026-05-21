import { useEffect } from "react";
import SiteHeader from "@/components/SiteHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSiteContent } from "@/hooks/useSiteContent";
import { trackEvent } from "@/lib/trackEvent";

const useText = (key: string, fallback: string) => {
  const { data } = useSiteContent(key);
  return data?.content?.trim() ? data.content : fallback;
};

const AboutPage = () => {
  const { t } = useLanguage();
  useEffect(() => { trackEvent("page_view"); }, []);

  const sections = [
    { title: useText("about_chi_title", t("aboutChiTitle")), body: useText("about_chi_body", t("aboutChiBody")) },
    { title: useText("about_perchi_title", t("aboutPerChiTitle")), body: useText("about_perchi_body", t("aboutPerChiBody")) },
    { title: useText("about_alieno_title", t("aboutAlienoTitle")), body: useText("about_alieno_body", t("aboutAlienoBody")) },
    { title: useText("about_principio_title", t("aboutPrincipioTitle")), body: useText("about_principio_body", t("aboutPrincipioBody")) },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="px-6 md:px-12 py-10 md:py-14 pb-24 max-w-3xl">
        <h2 className="font-sans uppercase tracking-widest text-[11px] md:text-xs text-foreground/60 mb-10">
          {t("navAbout")}
        </h2>
        <div className="space-y-10 font-sans text-sm md:text-base leading-relaxed text-foreground/80 whitespace-pre-line">
          {sections.map((s, i) => (
            <section key={i}>
              <h3 className="font-sans uppercase tracking-widest text-[11px] md:text-xs text-foreground mb-3">
                {s.title}
              </h3>
              <p>{s.body}</p>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AboutPage;
