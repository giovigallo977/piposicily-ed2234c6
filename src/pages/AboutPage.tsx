import { useEffect } from "react";
import SiteHeader from "@/components/SiteHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import { trackEvent } from "@/lib/trackEvent";

const AboutPage = () => {
  const { t } = useLanguage();
  useEffect(() => { trackEvent("page_view", { page: "about" }); }, []);

  const sections = [
    { title: t("aboutChiTitle"), body: t("aboutChiBody") },
    { title: t("aboutPerChiTitle"), body: t("aboutPerChiBody") },
    { title: t("aboutAlienoTitle"), body: t("aboutAlienoBody") },
    { title: t("aboutPrincipioTitle"), body: t("aboutPrincipioBody") },
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
