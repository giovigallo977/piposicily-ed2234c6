import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronsLeft, ArrowRight, MapPin } from "lucide-react";
import pipoAlien from "@/assets/pipo-alien-new.png";
import { useHotspots } from "@/hooks/useHotspots";
import { useAnalytics } from "@/hooks/useAnalytics";

type WizardStep = "main" | "zona" | "mood";

const WizardPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<WizardStep>("main");
  const { data: hotspots } = useHotspots();
  const { trackWizardZonaSelected, trackWizardMoodSelected, trackWizardCompleted } = useAnalytics();

  // Extract unique zones from hotspots
  const zones = useMemo(() => {
    if (!hotspots) return [];
    const uniqueZones = [...new Set(hotspots.map(h => h.zona).filter(Boolean))];
    return uniqueZones as string[];
  }, [hotspots]);

  // Extract unique moods (tags) from hotspots - NO DUPLICATES
  const moods = useMemo(() => {
    if (!hotspots) return [];
    const allTags = hotspots.flatMap(h => h.tags || []).filter(Boolean);
    const uniqueTags = [...new Set(allTags)];
    return uniqueTags as string[];
  }, [hotspots]);

  const handleBack = () => {
    if (step === "main") {
      navigate("/");
    } else {
      setStep("main");
    }
  };

  const handleZoneSelect = (zone: string) => {
    trackWizardZonaSelected(zone);
    trackWizardCompleted(zone, null);
    navigate(`/esplora?zona=${encodeURIComponent(zone)}`);
  };

  const handleMoodSelect = (mood: string) => {
    trackWizardMoodSelected(null, mood);
    trackWizardCompleted(null, mood);
    navigate(`/esplora?mood=${encodeURIComponent(mood)}`);
  };

  const handleExploreAll = () => {
    trackWizardCompleted(null, null);
    navigate("/esplora");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header with back button and alien */}
      <header className="py-4 px-6 flex items-center justify-between">
        <button
          onClick={handleBack}
          className="p-2 transition-all duration-200 hover:scale-110"
          aria-label="Torna indietro"
        >
          <ChevronsLeft className="w-8 h-8 text-black" strokeWidth={2.5} />
        </button>
        
        <img
          src={pipoAlien}
          alt="Pipo"
          className="h-12 w-12 object-contain"
          draggable={false}
        />
        
        <div className="w-12" /> {/* Spacer for balance */}
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
        
        {/* MAIN MENU STEP */}
        {step === "main" && (
          <>
            {/* Title */}
            <h1 className="font-bubbles text-[28px] text-foreground text-center mb-8">
              Portami via in 30 secondi
            </h1>

            {/* Signpost-style menu */}
            <div className="w-full max-w-xs">
              {/* Sign container */}
              <div className="bg-white border-[3px] border-black rounded-lg p-4 relative">
                {/* Top peg */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-4 h-6 bg-black rounded-t-sm" />
                
                {/* Menu options */}
                <div className="space-y-4">
                  <button
                    onClick={() => setStep("zona")}
                    className="flex items-center justify-between w-full py-2 group"
                  >
                    <span className="font-sans text-xl font-bold italic text-foreground">
                      Zona
                    </span>
                    <div className="flex items-center text-olive">
                      <ArrowRight className="w-6 h-6" strokeWidth={3} />
                      <ArrowRight className="w-6 h-6 -ml-3" strokeWidth={3} />
                    </div>
                  </button>

                  <button
                    onClick={() => setStep("mood")}
                    className="flex items-center justify-between w-full py-2 group"
                  >
                    <span className="font-sans text-xl font-bold italic text-foreground">
                      Mood
                    </span>
                    <div className="flex items-center text-olive">
                      <ArrowRight className="w-6 h-6" strokeWidth={3} />
                      <ArrowRight className="w-6 h-6 -ml-3" strokeWidth={3} />
                    </div>
                  </button>

                  <button
                    onClick={handleExploreAll}
                    className="flex items-center justify-between w-full py-2 group"
                  >
                    <span className="font-sans text-xl font-bold italic text-foreground">
                      Esplora in Libertà
                    </span>
                    <div className="flex items-center text-olive">
                      <ArrowRight className="w-6 h-6" strokeWidth={3} />
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

            {/* Bottom text */}
            <p className="text-muted-foreground font-sans italic text-lg mt-6">
              adesso tocca a te
            </p>
          </>
        )}

        {/* ZONA STEP */}
        {step === "zona" && (
          <>
            {/* Alien with speech bubble */}
            <div className="relative mb-6">
              <img
                src={pipoAlien}
                alt="Pipo"
                className="h-16 w-16 object-contain"
                draggable={false}
              />
              <div className="absolute -right-20 top-0 bg-white border border-muted rounded-xl px-3 py-1 text-sm font-sans italic">
                Muoviti
                <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-white border-l border-b border-muted transform rotate-45" />
              </div>
            </div>

            {/* Title */}
            <h1 className="font-bubbles text-[28px] text-foreground text-center mb-8">
              Zona
            </h1>

            {/* Zone list */}
            <div className="w-full max-w-xs space-y-4">
              {zones.map((zone) => (
                <button
                  key={zone}
                  onClick={() => handleZoneSelect(zone)}
                  className="flex items-center gap-4 w-full py-2 group"
                >
                  <MapPin className="w-6 h-6 text-red-600 fill-red-600" />
                  <span className="font-sans text-xl font-bold italic text-foreground">
                    {zone}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* MOOD STEP */}
        {step === "mood" && (
          <>
            {/* Title */}
            <h1 className="font-bubbles text-[28px] text-foreground text-center mb-8">
              Mood
            </h1>

            {/* Mood list - UNIQUE tags only */}
            <div className="w-full max-w-xs space-y-4">
              {moods.map((mood) => (
                <button
                  key={mood}
                  onClick={() => handleMoodSelect(mood)}
                  className="w-full py-2"
                >
                  <span className="font-sans text-xl font-bold italic text-foreground">
                    {mood}
                  </span>
                </button>
              ))}
            </div>

            {/* Alien at bottom with speech bubble */}
            <div className="mt-auto pt-10 relative">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white border border-muted rounded-xl px-3 py-1 text-sm font-sans italic whitespace-nowrap">
                ancora qui sei?
                <div className="absolute bottom-0 left-1/2 translate-y-1 -translate-x-1/2 w-2 h-2 bg-white border-r border-b border-muted transform rotate-45" />
              </div>
              <img
                src={pipoAlien}
                alt="Pipo"
                className="h-16 w-16 object-contain mx-auto"
                draggable={false}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default WizardPage;
