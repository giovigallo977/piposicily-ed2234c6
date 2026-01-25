import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronsLeft, ArrowRight } from "lucide-react";
import pipoAlien from "@/assets/pipo-alien-new.png";
import pinIcon from "@/assets/pin-icon.png";
import { useHotspots } from "@/hooks/useHotspots";
import { useLanguage } from "@/contexts/LanguageContext";
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
            <h1 className="font-bubbles text-foreground text-center mb-8 text-xl">
              {t("wizardTitle")}
            </h1>

            {/* Signpost-style menu */}
            <div className="w-full max-w-xs">
              {/* Sign container */}
              <div className="bg-white border-[3px] border-black rounded-lg p-4 relative">
                {/* Top peg */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-4 h-6 bg-black rounded-t-sm" />
                
                {/* Menu options */}
                <div className="space-y-4">
                  <button onClick={() => handleStepChange("zona")} className="flex items-center justify-between w-full py-2 group">
                    <span className="font-sans text-xl font-bold italic text-foreground">
                      {t("wizardZona")}
                    </span>
                    <div className="flex items-center text-olive">
                      
                      <ArrowRight className="w-6 h-6 -ml-3" strokeWidth={3} />
                    </div>
                  </button>

                  <button onClick={() => handleStepChange("mood")} className="flex items-center justify-between w-full py-2 group">
                    <span className="font-sans text-xl font-bold italic text-foreground">
                      {t("wizardMood")}
                    </span>
                    <div className="flex items-center text-olive">
                      
                      <ArrowRight className="w-6 h-6 -ml-3" strokeWidth={3} />
                    </div>
                  </button>

                  <button onClick={handleExploreAll} className="flex items-center justify-between w-full py-2 group">
                    <span className="font-sans text-xl font-bold italic text-foreground">
                      {t("wizardExplore")}
                    </span>
                    <div className="flex items-center text-olive">
                      
                      <ArrowRight className="w-6 h-6 -ml-3" strokeWidth={3} />
                    </div>
                  </button>
                </div>
              </div>

              {/* Sign pole */}
              <div className="flex justify-center">
                <div className="w-4 h-32 bg-black" />
              </div>
            </div>

            {/* Bottom text - same font family as Zona/Mood but not bold/italic, gray */}
            <p className="text-muted-foreground font-sans text-xl mt-6">
              {t("wizardYourTurn")}
            </p>
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
                  <span className="font-sans text-xl font-bold italic text-foreground">
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
                  <span className="font-sans text-xl font-bold italic text-foreground">
                    {mood}
                  </span>
                </button>)}
            </div>
          </>}
      </main>
    </div>;
};
export default WizardPage;