import SiteHeader from "@/components/SiteHeader";
import { useLanguage } from "@/contexts/LanguageContext";

const MapPage = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <SiteHeader />
      <main className="flex-1 flex flex-col">
        <div className="px-6 md:px-12 pt-8 pb-4">
          <h2 className="font-sans uppercase tracking-widest text-xs md:text-sm text-foreground font-semibold">
            {t("mapTitle")}
          </h2>
          <p className="mt-1 font-sans text-[11px] md:text-xs text-foreground/60 tracking-wide">
            {t("mapSubtitle")}
          </p>
        </div>
        <div className="flex-1 w-full">
          <iframe
            src="https://www.google.com/maps/d/embed?mid=1J3iJLzT2CNJp2HNJ7l3wk8VFeI6NsUk&ehbc=2E312F&noprof=1"
            width="100%"
            height="100%"
            style={{ border: "none", minHeight: "calc(100vh - 80px)" }}
            loading="lazy"
            allowFullScreen
            title={t("mapTitle")}
          />
        </div>
      </main>
    </div>
  );
};

export default MapPage;
