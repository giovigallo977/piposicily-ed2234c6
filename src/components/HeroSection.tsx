import { useNavigate } from "react-router-dom";

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
  "deco_collezioni_left",
  "deco_collezioni_right",
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

  // Decorative graphics
  const { data: decoHeroLT } = useSiteContent("deco_hero_left_top");
  const { data: decoHeroLB } = useSiteContent("deco_hero_left_bottom");
  const { data: decoHeroRT } = useSiteContent("deco_hero_right_top");
  const { data: decoHeroRB } = useSiteContent("deco_hero_right_bottom");
  const { data: decoCollLeft } = useSiteContent("deco_collezioni_left");
  const { data: decoCollRight } = useSiteContent("deco_collezioni_right");

  const headlineText = heroHeadlineContent?.content || null;
  const subtitleText = heroSubtitleContent?.content || null;
  const exploreCtaText = exploreCtaContent?.content || null;

  const { translatedText: translatedHeadline } = useTranslatedContent(headlineText);
  const { translatedText: translatedSubtitle } = useTranslatedContent(subtitleText);
  const { translatedText: translatedExploreCta } = useTranslatedContent(exploreCtaText);

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
      className="relative px-6 py-12 flex flex-col min-h-[75vh] justify-center overflow-hidden"
      style={{ backgroundColor: bgColor || undefined }}
    >
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

        {/* 2x2 Category Grid */}
        <div className="grid grid-cols-2 gap-3 mt-6 w-full max-w-lg md:mx-auto">
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
        </div>

        {/* Collezioni Card - full width with deco graphics */}
        <div className="mt-3 w-full max-w-lg md:mx-auto relative">
          {decoCollLeft?.content && (
            <img src={decoCollLeft.content} alt="" className="absolute -left-2 md:-left-6 top-1/2 -translate-y-1/2 w-10 md:w-16 pointer-events-none select-none opacity-80 z-10" />
          )}
          {decoCollRight?.content && (
            <img src={decoCollRight.content} alt="" className="absolute -right-2 md:-right-6 top-1/2 -translate-y-1/2 w-10 md:w-16 pointer-events-none select-none opacity-80 z-10" />
          )}
          <button
            onClick={() => handleCategoryClick("Collezioni")}
            className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden group focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {collezioniImage ? (
              <img
                src={collezioniImage}
                alt="Collezioni"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-muted" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <span className="absolute bottom-3 left-3 right-3 text-white font-sans text-lg md:text-xl font-bold text-left leading-tight drop-shadow-lg">
              Collezioni
            </span>
          </button>
        </div>

        {/* Mission Content from DB */}
        <MissionSection
          missionContent={missionContent?.content}
        />
      </div>
    </section>
  );
};

export default HeroSection;
