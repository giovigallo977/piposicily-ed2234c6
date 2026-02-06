import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronsLeft, ArrowRight } from "lucide-react";
import pinIcon from "@/assets/pin-icon.png";
import { useHotspots } from "@/hooks/useHotspots";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSiteContent } from "@/hooks/useSiteContent";
type WizardStep = "main" | "zona" | "mood";
const WizardPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Initialize step from URL param (for back navigation from Explore)
  const initialStep = searchParams.get("step") as WizardStep || "main";
  const [step, setStep] = useState<WizardStep>(initialStep);

  // Update step when URL changes (e.g., browser back button)
  useEffect(() => {
    const urlStep = searchParams.get("step") as WizardStep;
    if (urlStep && urlStep !== step) {
      setStep(urlStep);
    }
  }, [searchParams]);
  const {
    data: hotspots
  } = useHotspots();
  const {
    t
  } = useLanguage();
  const {
    data: instagramLinkContent
  } = useSiteContent("wizard_instagram_link");
  const {
    data: alienMapTitleContent
  } = useSiteContent("alien_map_cta_title");
  const {
    data: alienMapDescContent
  } = useSiteContent("alien_map_cta_desc");
  const {
    data: instagramBtnContent
  } = useSiteContent("instagram_cta_btn");
  
  const instagramLink = instagramLinkContent?.content || "#";
  const alienMapTitle = alienMapTitleContent?.content || t("alienMapCtaTitle");
  const alienMapDesc = alienMapDescContent?.content || t("alienMapCtaDesc");
  const instagramBtn = instagramBtnContent?.content || t("instagramCtaBtn");

  // Extract unique zones from hotspots
  const zones = useMemo(() => {
    if (!hotspots) return [];
    const uniqueZones = [...new Set(hotspots.map(h => h.zona).filter(Boolean))];
    return uniqueZones as string[];
  }, [hotspots]);

  // Extract unique moods (tags) from hotspots - NO DUPLICATES
  // Trim whitespace to handle "Pace" vs "Pace " as duplicates
  const moods = useMemo(() => {
    if (!hotspots) return [];
    const allTags = hotspots.flatMap(h => h.tags || []).filter(Boolean).map(tag => tag.trim()) // Trim whitespace
    .filter(tag => tag.length > 0); // Remove empty after trim
    const uniqueTags = [...new Set(allTags)];
    return uniqueTags as string[];
  }, [hotspots]);
  const handleBack = () => {
    if (step === "main") {
      navigate("/");
    } else {
      // Update URL when going back to main
      navigate("/wizard", {
        replace: true
      });
      setStep("main");
    }
  };

  // Update URL when changing steps (for proper back navigation)
  const handleStepChange = (newStep: WizardStep) => {
    navigate(`/wizard?step=${newStep}`, {
      replace: true
    });
    setStep(newStep);
  };
  const handleZoneSelect = (zone: string) => {
    navigate(`/esplora?zona=${encodeURIComponent(zone)}`);
  };
  const handleMoodSelect = (mood: string) => {
    navigate(`/esplora?mood=${encodeURIComponent(mood)}`);
  };
  const handleExploreAll = () => {
    navigate("/esplora");
  };
  return <div className="min-h-screen bg-background flex flex-col">
      {/* Header with back button and alien */}
      <header className="py-4 px-6 flex items-center justify-between">
        <button onClick={handleBack} className="p-2 transition-all duration-200 hover:scale-110" aria-label={t("backLabel")}>
          <ChevronsLeft className="w-8 h-8 text-black" strokeWidth={2.5} />
        </button>
        
        <img alt="Pipo" className="h-12 w-12 object-contain" draggable={false} src="/lovable-uploads/35ab6758-bcb8-4ecc-b6fa-6d4335fff8cd.png" />
        
        <div className="w-12" /> {/* Spacer for balance */}
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
        
        {/* MAIN MENU STEP */}
        {step === "main" && <>
            {/* Title */}
            <h1 className="font-bubbles text-foreground text-center mb-8 text-3xl font-bold">
              {t("wizardTitle")}
            </h1>

            {/* Menu options - CENTERED */}
            <div className="w-full max-w-sm md:max-w-md space-y-4">
              <button onClick={() => handleStepChange("zona")} className="flex items-center justify-center gap-3 w-full py-2 group">
                <span className="font-sans text-xl font-bold text-foreground">
                  {t("wizardZona")}
                </span>
                <ArrowRight className="w-5 h-5 text-olive" strokeWidth={3} />
              </button>

              <button onClick={() => handleStepChange("mood")} className="flex items-center justify-center gap-3 w-full py-2 group">
                <span className="font-sans text-xl font-bold text-foreground">
                  {t("wizardMood")}
                </span>
                <ArrowRight className="w-5 h-5 text-olive" strokeWidth={3} />
              </button>

              <button onClick={handleExploreAll} className="flex items-center justify-center gap-3 w-full py-2 group">
                <span className="font-sans text-xl font-bold text-foreground">
                  {t("wizardExplore")}
                </span>
                <ArrowRight className="w-5 h-5 text-olive" strokeWidth={3} />
              </button>
            </div>

            {/* Instagram CTA Section - End of funnel */}
            <div className="mt-10 text-center max-w-xs">
              <h2 className="font-sans text-lg font-bold text-foreground mb-3">
                {alienMapTitle}
              </h2>
              <p className="font-sans text-sm text-secondary-foreground mb-4">
                {alienMapDesc}
              </p>
              <a href={instagramLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-6 py-3 font-sans font-bold text-base rounded-full transition-transform duration-200 hover:scale-105 bg-fuchsia-700 text-primary-foreground">
                {instagramBtn}
              </a>
            </div>
          </>}

        {/* ZONA STEP */}
        {step === "zona" && <>
            {/* Title */}
            <h1 className="font-bubbles text-[28px] text-foreground text-center mb-8">
              {t("wizardZona")}
            </h1>

            {/* Zone list - centered mobile-first */}
            <div className="w-full max-w-xs flex flex-col items-center gap-5">
              {zones.map(zone => <button key={zone} onClick={() => handleZoneSelect(zone)} className="flex items-center justify-center gap-3 w-full py-3 group">
                  <img src={pinIcon} alt="" className="h-6 w-auto object-contain" draggable={false} />
                  <span className="font-sans text-xl font-bold text-foreground">
                    {zone}
                  </span>
                </button>)}
            </div>
          </>}

        {/* MOOD STEP */}
        {step === "mood" && <>
            {/* Title */}
            <h1 className="font-bubbles text-[28px] text-foreground text-center mb-8">
              {t("wizardMood")}
            </h1>

            {/* Mood list - UNIQUE tags only */}
            <div className="w-full max-w-xs space-y-4">
              {moods.map(mood => <button key={mood} onClick={() => handleMoodSelect(mood)} className="w-full py-2">
                  <span className="font-sans text-xl font-bold text-foreground">
                    {mood}
                  </span>
                </button>)}
            </div>
          </>}
      </main>
    </div>;
};
export default WizardPage;