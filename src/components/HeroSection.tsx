import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useHotspots } from "@/hooks/useHotspots";
import { useSiteContent } from "@/hooks/useSiteContent";
import { useTranslatedContent } from "@/hooks/useTranslation";
import { useMemo } from "react";

interface HeroSectionProps {
  onCtaClick: () => void;
  bgColor?: string;
}

const CATEGORIES = [
  { key: "catLuoghiFantasma" as const, dbValue: "Luoghi Fantasma" },
  { key: "catNatura" as const, dbValue: "Natura" },
  { key: "catBorghi" as const, dbValue: "Borghi" },
  { key: "catArteECultura" as const, dbValue: "Arte e Cultura" },
];

const HeroSection = ({ onCtaClick, bgColor }: HeroSectionProps) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { data: hotspots } = useHotspots();

  // Fetch editable content from database
  const { data: heroHeadlineContent } = useSiteContent("hero_headline");
  const { data: heroSubtitleContent } = useSiteContent("hero_subtitle");
  const { data: missionContent, isLoading: missionLoading } = useSiteContent("mission");
  const { data: missionPart2Content, isLoading: missionPart2Loading } = useSiteContent("mission_part2");

  // Translate ALL database content
  const missionText = missionContent?.content || null;
  const missionPart2Text = missionPart2Content?.content || null;
  const headlineText = heroHeadlineContent?.content || null;
  const subtitleText = heroSubtitleContent?.content || null;

  const { translatedText: translatedMission, isTranslating: isTranslating1 } = useTranslatedContent(missionText);
  const { translatedText: translatedMissionPart2, isTranslating: isTranslating2 } = useTranslatedContent(missionPart2Text);
  const { translatedText: translatedHeadline } = useTranslatedContent(headlineText);
  const { translatedText: translatedSubtitle } = useTranslatedContent(subtitleText);

  const headline = translatedHeadline || t("heroHeadline");
  const subtitle = translatedSubtitle || t("heroSubheadline");

  // Get first hotspot photo per category for the grid
  const categoryImages = useMemo(() => {
    if (!hotspots) return {};
    const map: Record<string, string> = {};
    for (const cat of CATEGORIES) {
      const match = hotspots.find(h => h.categoria === cat.dbValue && h.foto_principale);
      if (match?.foto_principale) {
        map[cat.dbValue] = match.foto_principale;
      }
    }
    return map;
  }, [hotspots]);

  const handleCategoryClick = (category: string) => {
    navigate(`/esplora?categoria=${encodeURIComponent(category)}`);
  };

  return (
    <section
      className="px-6 py-12 flex flex-col min-h-[75vh] justify-center"
      style={{ backgroundColor: bgColor || undefined }}
    >
      <div className="max-w-4xl mx-auto w-full md:flex md:flex-col md:items-center">
        {/* Headline */}
        <h1 className="font-sans text-[32px] md:text-[48px] font-bold leading-[1.1] text-foreground text-left md:text-center">
          {headline}
        </h1>

        {/* Subtitle */}
        <p className="font-sans text-base font-medium text-foreground text-left md:text-center mt-6 max-w-md md:mx-auto">
          {subtitle}
        </p>

        {/* CTA Text */}
        <p className="font-sans text-lg font-bold italic text-foreground text-center mt-10">
          {t("exploreCta")}
        </p>

        {/* 2x2 Category Grid */}
        <div className="grid grid-cols-2 gap-3 mt-6 w-full max-w-lg md:mx-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.dbValue}
              onClick={() => handleCategoryClick(cat.dbValue)}
              className="relative aspect-square rounded-2xl overflow-hidden group focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {categoryImages[cat.dbValue] ? (
                <img
                  src={categoryImages[cat.dbValue]}
                  alt={t(cat.key)}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-muted" />
              )}
              {/* Dark overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              {/* Category title */}
              <span className="absolute bottom-3 left-3 right-3 text-white font-sans text-sm md:text-base font-bold text-left leading-tight drop-shadow-lg">
                {t(cat.key)}
              </span>
            </button>
          ))}
        </div>

        {/* Mission Content */}
        {(missionContent || missionPart2Content) && (
          <div className="w-full mt-16 max-w-md md:mx-auto">
            {missionLoading || missionPart2Loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                {missionContent && (
                  <p className={`font-sans text-base font-medium text-foreground leading-relaxed text-center whitespace-pre-wrap ${isTranslating1 ? "opacity-50" : ""}`}>
                    {translatedMission || missionContent.content}
                  </p>
                )}

                <div className="w-full max-w-sm mt-10 mb-10 mx-auto">
                  <button
                    onClick={onCtaClick}
                    className="w-full px-8 py-3 font-sans text-base font-medium bg-transparent text-foreground border-2 border-foreground rounded-full transition-all duration-200 hover:bg-foreground/5 active:scale-[0.98]"
                  >
                    {t("heroSecondaryCtaBtn")}
                  </button>
                </div>

                {missionPart2Content && (
                  <p className={`font-sans text-base font-medium text-foreground leading-relaxed text-center whitespace-pre-wrap ${isTranslating2 ? "opacity-50" : ""}`}>
                    {translatedMissionPart2 || missionPart2Content.content}
                  </p>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
