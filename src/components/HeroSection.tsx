import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Instagram } from "lucide-react";

import { useLanguage } from "@/contexts/LanguageContext";
import { useHotspots } from "@/hooks/useHotspots";
import { useSiteContent } from "@/hooks/useSiteContent";
import { useTranslatedContent } from "@/hooks/useTranslation";
import MissionSection from "@/components/MissionSection";

import ExperienceWaitlistModal from "@/components/ExperienceWaitlistModal";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/trackEvent";

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
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const { data: hotspots } = useHotspots();

  const { data: heroHeadlineContent, isLoading: isLoadingHeadline } = useSiteContent("hero_headline");
  const { data: heroBgImageContent } = useSiteContent("hero_bg_image");
  const { data: heroSubtitleContent } = useSiteContent("hero_subtitle");
  const { data: exploreCtaContent } = useSiteContent("explore_cta_text");
  const { data: missionContent } = useSiteContent("mission");

  // Category images from DB
  const { data: catImgLuoghi } = useSiteContent("cat_image_luoghi_fantasma");
  const { data: catImgNatura } = useSiteContent("cat_image_natura");
  const { data: catImgBorghi } = useSiteContent("cat_image_borghi");
  const { data: catImgArte } = useSiteContent("cat_image_arte_cultura");
  
  const { data: catImgFreeSpots } = useSiteContent("cat_image_free_spots");
  // Free Spots card labels
  const { data: freeSpotsLabelContent } = useSiteContent("cat_label_free_spots");
  const { data: freeSpotsSubLabelContent } = useSiteContent("cat_sublabel_free_spots");

  // Decorative graphics
  const { data: decoHeroLT } = useSiteContent("deco_hero_left_top");
  const { data: decoHeroLB } = useSiteContent("deco_hero_left_bottom");
  const { data: decoHeroRT } = useSiteContent("deco_hero_right_top");
  const { data: decoHeroRB } = useSiteContent("deco_hero_right_bottom");
  const { data: heroFontColorContent } = useSiteContent("hero_font_color");

  const heroBgImage = heroBgImageContent?.content || null;
  const hasHeroBg = !!heroBgImage;
  const heroFontColor = heroFontColorContent?.content || null;

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

  const headline = isLoadingHeadline ? "" : (translatedHeadline || t("heroHeadline"));
  const subtitle = isLoadingHeadline ? "" : (translatedSubtitle || t("heroSubheadline"));
  const exploreCta = isLoadingHeadline ? "" : (translatedExploreCta || t("exploreCta"));

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


  const getCategoryImage = (dbValue: string) => {
    return dbCategoryImages[dbValue] || hotspotCategoryImages[dbValue];
  };

  const handleCategoryClick = (category: string) => {
    navigate(`/esplora?categoria=${encodeURIComponent(category)}`);
  };

  const CategoryCard = ({ cat }: { cat: typeof CATEGORIES[number] }) => {
    const img = getCategoryImage(cat.dbValue);
    return (
      <button
        onClick={() => handleCategoryClick(cat.dbValue)}
        className="relative aspect-square rounded-2xl overflow-hidden group focus:outline-none focus:ring-2 focus:ring-primary"
      >
        {img ? (
          <img src={img} alt={t(cat.key)} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full bg-muted" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <span className="absolute bottom-3 left-3 right-3 text-white font-sans text-sm md:text-base font-bold text-left leading-tight drop-shadow-lg">{t(cat.key)}</span>
      </button>
    );
  };

  return (
    <section
      className="relative flex flex-col overflow-hidden"
      style={{ backgroundColor: bgColor || undefined }}
    >
      {/* Fullscreen hero text area */}
      <div className="relative min-h-[100dvh] flex flex-col items-center justify-center px-6">
        {hasHeroBg && (
          <img src={heroBgImage} alt="" className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none select-none" />
        )}

        {/* Decorative graphics */}
        {decoHeroLT?.content && (
          <img src={decoHeroLT.content} alt="" className="absolute left-2 top-16 w-20 lg:w-28 hidden md:block pointer-events-none select-none opacity-80 z-[1]" />
        )}
        {decoHeroRT?.content && (
          <img src={decoHeroRT.content} alt="" className="absolute right-2 top-16 w-20 lg:w-28 hidden md:block pointer-events-none select-none opacity-80 z-[1]" />
        )}
        {decoHeroLB?.content && (
          <img src={decoHeroLB.content} alt="" className="absolute left-2 bottom-[40%] w-20 lg:w-28 hidden md:block pointer-events-none select-none opacity-80 z-[1]" />
        )}
        {decoHeroRB?.content && (
          <img src={decoHeroRB.content} alt="" className="absolute right-2 bottom-[40%] w-20 lg:w-28 hidden md:block pointer-events-none select-none opacity-80 z-[1]" />
        )}

        <div className="max-w-4xl mx-auto w-full flex flex-col items-center relative z-10 -mt-12">
          <h1
            className={`font-sans text-[32px] md:text-[48px] font-bold leading-[1.1] text-center ${!heroFontColor ? (hasHeroBg ? "text-white" : "text-foreground") : ""}`}
            style={heroFontColor ? { color: heroFontColor } : undefined}
          >
            {headline}
          </h1>
          <p
            className={`font-sans text-xl md:text-2xl font-bold text-center mt-8 max-w-md mx-auto ${!heroFontColor ? (hasHeroBg ? "text-white/90" : "text-foreground") : ""}`}
            style={heroFontColor ? { color: heroFontColor } : undefined}
          >
            {subtitle}
          </p>
          <p
            className={`font-sans text-base md:text-xl font-bold text-center mt-6 ${!heroFontColor ? (hasHeroBg ? "text-white" : "text-foreground") : ""}`}
            style={heroFontColor ? { color: heroFontColor } : undefined}
          >
            {exploreCta}
          </p>
          <div className="mt-8 flex flex-col items-center gap-1">
            <span
              className={`text-xs font-medium ${!heroFontColor ? "text-white/70" : ""}`}
              style={heroFontColor ? { color: heroFontColor, opacity: 0.7 } : undefined}
            >
              {t("scrollDown")}
            </span>
            <ChevronDown
              className={`w-8 h-8 animate-bounce ${!heroFontColor ? "text-white/80" : ""}`}
              style={heroFontColor ? { color: heroFontColor, opacity: 0.8 } : undefined}
            />
          </div>
        </div>
      </div>

      {/* Content below hero */}
      <div className="px-6 py-12">
        <div className="max-w-4xl mx-auto w-full md:flex md:flex-col md:items-center">

          {/* SECTION 1: Decision cards */}
          <div className="w-full max-w-lg md:mx-auto mb-16">
            <h2
              className={`font-sans text-xl md:text-2xl font-bold text-center mb-8 ${!heroFontColor ? (hasHeroBg ? "text-white" : "text-foreground") : ""}`}
              style={heroFontColor ? { color: heroFontColor } : undefined}
            >
              {t("chooseDayTitle")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Card 1: Self trip */}
              <div className="min-w-0 flex flex-col items-center rounded-2xl border border-border bg-card p-4 sm:p-5 text-center gap-3">
                <span className="text-2xl sm:text-3xl">🚗</span>
                <p className="min-w-0 w-full break-words font-sans text-lg sm:text-xl md:text-2xl font-bold text-card-foreground whitespace-pre-line leading-tight">
                  {t("selfTripTitle")}
                </p>
                <Button
                  size="sm"
                  className="mt-auto w-full min-w-0 whitespace-normal break-words font-bold text-xs leading-tight"
                  style={{ backgroundColor: 'hsl(var(--cta-yellow))', color: 'hsl(var(--cta-yellow-foreground))' }}
                  onClick={() => {
                    trackEvent("cta_self_trip");
                    navigate("/collezioni");
                  }}
                >
                  {t("selfTripCta")}
                </Button>
              </div>
              {/* Card 2: Experience */}
              <div className="min-w-0 flex flex-col items-center rounded-2xl border border-border bg-card p-4 sm:p-5 text-center gap-3">
                <span className="text-2xl sm:text-3xl">🚐</span>
                <p className="min-w-0 w-full break-words font-sans text-lg sm:text-xl md:text-2xl font-bold text-card-foreground whitespace-pre-line leading-tight">
                  {t("experienceTitle")}
                </p>
                <Button
                  size="sm"
                  className="mt-auto w-full min-w-0 whitespace-normal break-words font-bold text-xs leading-tight"
                  style={{ backgroundColor: 'hsl(var(--cta-yellow))', color: 'hsl(var(--cta-yellow-foreground))' }}
                  onClick={() => {
                    trackEvent("cta_experience");
                    setWaitlistOpen(true);
                  }}
                >
                  {t("experienceCta")}
                </Button>
              </div>
            </div>
          </div>

          {/* SECTION 2: Browse / Curiosare */}
          <div className="w-full max-w-lg md:mx-auto">
            <h2
              className={`font-sans text-xl md:text-2xl font-bold text-center mb-2 ${!heroFontColor ? (hasHeroBg ? "text-white" : "text-foreground") : ""}`}
              style={heroFontColor ? { color: heroFontColor } : undefined}
            >
              {t("browseTitle")}
            </h2>
            <p
              className={`font-sans text-sm md:text-base text-center mb-8 ${!heroFontColor ? (hasHeroBg ? "text-white/70" : "text-muted-foreground") : ""}`}
              style={heroFontColor ? { color: heroFontColor, opacity: 0.7 } : undefined}
            >
              {t("browseSubtitle")}
            </p>
            <div className="grid grid-cols-2 gap-3 w-full">
              <CategoryCard cat={CATEGORIES[0]} />
              <CategoryCard cat={CATEGORIES[1]} />
              <CategoryCard cat={CATEGORIES[2]} />
              <CategoryCard cat={CATEGORIES[3]} />
              <button
                onClick={() => navigate("/free-spots")}
                className="relative aspect-square rounded-2xl overflow-hidden group focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {catImgFreeSpots?.content ? (
                  <img src={catImgFreeSpots.content} alt="Free Spots" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full bg-muted" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <span className="absolute bottom-3 left-3 right-3 text-white font-sans text-left leading-tight drop-shadow-lg">
                  <span className="text-sm md:text-base font-bold">{freeSpotsSubLabel}</span>
                </span>
              </button>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="mt-6 text-center">
            <p
              className={`font-sans text-base md:text-xl font-bold whitespace-pre-line ${!heroFontColor ? (hasHeroBg ? "text-white" : "text-foreground") : ""}`}
              style={heroFontColor ? { color: heroFontColor } : undefined}
            >
              {t("contactCta")}
            </p>
            <a
              href="https://instagram.com/pipo.fuoriradar"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 font-sans text-base md:text-xl font-bold hover:underline ${!heroFontColor ? (hasHeroBg ? "text-white" : "text-foreground") : ""}`}
              style={heroFontColor ? { color: heroFontColor } : undefined}
            >
              <Instagram className="w-5 h-5" />
              {t("igHandle")}
            </a>
          </div>

          {/* Mission Content from DB */}
          <MissionSection missionContent={missionContent?.content} />
        </div>
      </div>

      <ExperienceWaitlistModal open={waitlistOpen} onOpenChange={setWaitlistOpen} />
    </section>
  );
};

export default HeroSection;
