import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";

import { useLanguage } from "@/contexts/LanguageContext";
import { useHotspots } from "@/hooks/useHotspots";
import { useSiteContent } from "@/hooks/useSiteContent";
import { useTranslatedContent } from "@/hooks/useTranslation";
import { useMemo } from "react";
import MissionSection from "@/components/MissionSection";

const DECO_KEYS = [
  "deco_hero_left_top",
  "deco_hero_left_bottom",
  "deco_hero_right_top",
  "deco_hero_right_bottom",
] as const;

interface HeroSectionProps {
  bgColor?: string;
}

const CATEGORIES = [
  { key: "catLuoghiFantasma" as const, dbValue: "Luoghi Fantasma", contentKey: "cat_image_luoghi_fantasma" },
  { key: "catNatura" as const, dbValue: "Natura", contentKey: "cat_image_natura" },
  { key: "catBorghi" as const, dbValue: "Borghi", contentKey: "cat_image_borghi" },
  { key: "catArteECultura" as const, dbValue: "Arte e Cultura", contentKey: "cat_image_arte_cultura" },
];

const HeroSection = ({ bgColor }: HeroSectionProps) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { data: hotspots } = useHotspots();

  const { data: heroHeadlineContent } = useSiteContent("hero_headline");
  const { data: heroSubtitleContent } = useSiteContent("hero_subtitle");
  const { data: exploreCtaContent } = useSiteContent("explore_cta_text");
  const { data: missionContent } = useSiteContent("mission");

  // Category images from DB
  const { data: catImgLuoghi } = useSiteContent("cat_image_luoghi_fantasma");
  const { data: catImgNatura } = useSiteContent("cat_image_natura");
  const { data: catImgBorghi } = useSiteContent("cat_image_borghi");
  const { data: catImgArte } = useSiteContent("cat_image_arte_cultura");
  const { data: catImgCollezioni } = useSiteContent("cat_image_collezioni");
  const { data: catImgFreeSpots } = useSiteContent("cat_image_free_spots");
  // Free Spots card labels
  const { data: freeSpotsLabelContent } = useSiteContent("cat_label_free_spots");
  const { data: freeSpotsSubLabelContent } = useSiteContent("cat_sublabel_free_spots");

  // Decorative graphics
  const { data: decoHeroLT } = useSiteContent("deco_hero_left_top");
  const { data: decoHeroLB } = useSiteContent("deco_hero_left_bottom");
  const { data: decoHeroRT } = useSiteContent("deco_hero_right_top");
  const { data: decoHeroRB } = useSiteContent("deco_hero_right_bottom");

  const headlineText = heroHeadlineContent?.content || null;
  const subtitleText = heroSubtitleContent?.content || null;
  const exploreCtaText = exploreCtaContent?.content || null;

  const { translatedText: translatedHeadline } = useTranslatedContent(headlineText);
  const { translatedText: translatedSubtitle } = useTranslatedContent(subtitleText);
  const { translatedText: translatedExploreCta } = useTranslatedContent(exploreCtaText);
  const { translatedText: translatedFreeSpotsLabel } = useTranslatedContent(freeSpotsLabelContent?.content || null);
  const { translatedText: translatedFreeSpotsSubLabel } = useTranslatedContent(freeSpotsSubLabelContent?.content || null);

  const freeSpotsLabel = translatedFreeSpotsLabel || "Free Spots";
  const freeSpotsSubLabel = translatedFreeSpotsSubLabel || "Work, Study & Eat&Drink";

  const headline = translatedHeadline || t("heroHeadline");
  const subtitle = translatedSubtitle || t("heroSubheadline");
  const exploreCta = translatedExploreCta || t("exploreCta");

  // DB category images map
  const dbCategoryImages: Record<string, string | undefined> = {
    "Luoghi Fantasma": catImgLuoghi?.content,
    "Natura": catImgNatura?.content,
    "Borghi": catImgBorghi?.content,
    "Arte e Cultura": catImgArte?.content,
  };

  // Fallback: first hotspot image per category
  const hotspotCategoryImages = useMemo(() => {
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

  // Collezioni: DB image or fallback to first hotspot with photo
  const collezioniImage = useMemo(() => {
    if (catImgCollezioni?.content) return catImgCollezioni.content;
    if (!hotspots) return null;
    const withPhoto = hotspots.filter(h => h.foto_principale);
    return withPhoto.length > 0 ? withPhoto[0].foto_principale : null;
  }, [hotspots, catImgCollezioni]);

  const getCategoryImage = (dbValue: string) => {
    return dbCategoryImages[dbValue] || hotspotCategoryImages[dbValue];
  };

  const handleCategoryClick = (category: string) => {
    navigate(`/esplora?categoria=${encodeURIComponent(category)}`);
  };

  return (
    <section
      className="relative flex flex-col overflow-hidden"
      style={{ backgroundColor: bgColor || undefined }}
    >
      {/* Fullscreen hero text area */}
      <div className="relative min-h-[100dvh] flex flex-col items-center justify-center px-6">
        {/* Decorative graphics - hero laterals (desktop only) */}
        {decoHeroLT?.content && (
          <img src={decoHeroLT.content} alt="" className="absolute left-2 top-16 w-20 lg:w-28 hidden md:block pointer-events-none select-none opacity-80" />
        )}
        {decoHeroRT?.content && (
          <img src={decoHeroRT.content} alt="" className="absolute right-2 top-16 w-20 lg:w-28 hidden md:block pointer-events-none select-none opacity-80" />
        )}
        {decoHeroLB?.content && (
          <img src={decoHeroLB.content} alt="" className="absolute left-2 bottom-[40%] w-20 lg:w-28 hidden md:block pointer-events-none select-none opacity-80" />
        )}
        {decoHeroRB?.content && (
          <img src={decoHeroRB.content} alt="" className="absolute right-2 bottom-[40%] w-20 lg:w-28 hidden md:block pointer-events-none select-none opacity-80" />
        )}

        <div className="max-w-4xl mx-auto w-full md:flex md:flex-col md:items-center relative z-10">
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
            {exploreCta}
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <ChevronDown className="w-8 h-8 text-foreground/50 animate-bounce" />
        </div>
      </div>

      {/* Categories + Mission (visible on scroll) */}
      <div className="px-6 py-12">
        <div className="max-w-4xl mx-auto w-full md:flex md:flex-col md:items-center">
          {/* 2x2 Category Grid */}
          <div className="grid grid-cols-2 gap-3 w-full max-w-lg md:mx-auto">
            {CATEGORIES.map((cat) => {
              const img = getCategoryImage(cat.dbValue);
              return (
                <button
                  key={cat.dbValue}
                  onClick={() => handleCategoryClick(cat.dbValue)}
                  className="relative aspect-square rounded-2xl overflow-hidden group focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {img ? (
                    <img
                      src={img}
                      alt={t(cat.key)}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <span className="absolute bottom-3 left-3 right-3 text-white font-sans text-sm md:text-base font-bold text-left leading-tight drop-shadow-lg">
                    {t(cat.key)}
                  </span>
                </button>
              );
            })}
            {/* Collezioni Card */}
            <button
              onClick={() => navigate("/collezioni")}
              className="relative aspect-square rounded-2xl overflow-hidden group focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {collezioniImage ? (
                <img
                  src={collezioniImage}
                  alt={t("collections")}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-muted" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <span className="absolute bottom-3 left-3 right-3 text-white font-sans text-sm md:text-base font-bold text-left leading-tight drop-shadow-lg">
                {t("collections")}
              </span>
            </button>

            {/* Free Spots Card */}
            <button
              onClick={() => navigate("/free-spots")}
              className="relative aspect-square rounded-2xl overflow-hidden group focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {catImgFreeSpots?.content ? (
                <img
                  src={catImgFreeSpots.content}
                  alt="Lavorare, Studiare & Eat"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-muted" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <span className="absolute bottom-3 left-3 right-3 text-white font-sans text-left leading-tight drop-shadow-lg flex flex-col">
                <span className="text-sm md:text-base font-bold">{freeSpotsLabel}</span>
                <span className="text-xs md:text-sm font-medium opacity-90">{freeSpotsSubLabel}</span>
              </span>
            </button>
          </div>

          {/* Mission Content from DB */}
          <MissionSection
            missionContent={missionContent?.content}
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
