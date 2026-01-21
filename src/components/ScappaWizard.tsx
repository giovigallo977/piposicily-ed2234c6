import { useState } from "react";
import { MapPin, Sparkles, Compass, ArrowRight, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAnalytics } from "@/hooks/useAnalytics";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ScappaWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  zones: string[];
  moods: string[];
  onResult: (zone: string | null, mood: string | null, exploreAll?: boolean) => void;
}

type WizardStep = "main" | "zona" | "mood";

const ScappaWizard = ({ open, onOpenChange, zones, moods, onResult }: ScappaWizardProps) => {
  const [step, setStep] = useState<WizardStep>("main");
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const { t } = useLanguage();
  const { trackWizardZonaSelected, trackWizardMoodSelected, trackWizardCompleted } = useAnalytics();

  const handleZoneSelect = (zone: string) => {
    setSelectedZone(zone);
    trackWizardZonaSelected(zone);
    trackWizardCompleted(zone, null);
    onResult(zone, null);
    handleClose();
  };

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    trackWizardMoodSelected(null, mood);
    trackWizardCompleted(null, mood);
    onResult(null, mood);
    handleClose();
  };

  const handleExploreAll = () => {
    trackWizardCompleted(null, null);
    onResult(null, null, true);
    handleClose();
  };

  const handleClose = () => {
    setStep("main");
    setSelectedZone(null);
    setSelectedMood(null);
    onOpenChange(false);
  };

  const handleBack = () => {
    setStep("main");
  };

  const getStepTitle = () => {
    switch (step) {
      case "main":
        return "Come vuoi esplorare?";
      case "zona":
        return "Da dove parti?";
      case "mood":
        return "Cosa cerchi ora?";
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-background border-0 rounded-3xl shadow-2xl p-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 text-center bg-olive">
          <DialogTitle className="text-white font-sans font-bold text-xl flex items-center justify-center gap-2">
            <span className="text-2xl">👽</span>
            Decidi in 30 secondi
          </DialogTitle>
          <p className="text-white/90 text-sm mt-1">
            {getStepTitle()}
          </p>
        </DialogHeader>

        {/* Step indicator */}
        <div className="flex justify-center gap-2 py-3">
          <div 
            className={`w-2 h-2 rounded-full transition-all ${step === "main" ? 'bg-olive w-6' : 'bg-gray-300'}`} 
          />
          <div 
            className={`w-2 h-2 rounded-full transition-all ${step === "zona" || step === "mood" ? 'bg-olive w-6' : 'bg-gray-300'}`} 
          />
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          {/* Main menu - 3 options */}
          {step === "main" && (
            <div className="space-y-3">
              {/* Zona option */}
              <button
                onClick={() => setStep("zona")}
                className="flex items-center justify-between w-full px-5 py-4 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200 hover:scale-[1.02] group"
              >
                <span className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-olive" />
                  <span className="font-semibold">Zona</span>
                </span>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-olive transition-colors" />
              </button>

              {/* Mood option */}
              <button
                onClick={() => setStep("mood")}
                className="flex items-center justify-between w-full px-5 py-4 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200 hover:scale-[1.02] group"
              >
                <span className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-olive" />
                  <span className="font-semibold">Mood</span>
                </span>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-olive transition-colors" />
              </button>

              {/* Esplora in libertà option */}
              <button
                onClick={handleExploreAll}
                className="flex items-center justify-between w-full px-5 py-4 rounded-full bg-olive hover:bg-olive/90 transition-all duration-200 hover:scale-[1.02] group"
              >
                <span className="flex items-center gap-3 text-white">
                  <Compass className="w-5 h-5" />
                  <span className="font-semibold">Esplora in libertà</span>
                </span>
                <ArrowRight className="w-5 h-5 text-white/80" />
              </button>
            </div>
          )}

          {/* Zona selection */}
          {step === "zona" && (
            <div className="space-y-3">
              <p className="text-center text-sm text-muted-foreground mb-4">
                Seleziona la zona da cui parti
              </p>
              {zones.length > 0 ? (
                <div className="grid gap-3 max-h-64 overflow-y-auto">
                  {zones.map((zone) => (
                    <button
                      key={zone}
                      onClick={() => handleZoneSelect(zone)}
                      className="flex items-center justify-between w-full px-5 py-4 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200 hover:scale-[1.02] group"
                    >
                      <span className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-olive" />
                        <span className="font-medium">{zone}</span>
                      </span>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-olive transition-colors" />
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Nessuna zona disponibile
                </p>
              )}

              {/* Back button */}
              <button
                onClick={handleBack}
                className="w-full mt-4 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Torna indietro
              </button>
            </div>
          )}

          {/* Mood selection */}
          {step === "mood" && (
            <div className="space-y-3">
              <p className="text-center text-sm text-muted-foreground mb-4">
                Scegli l'atmosfera che cerchi
              </p>
              <div className="grid gap-3 max-h-64 overflow-y-auto">
                {moods.map((mood) => (
                  <button
                    key={mood}
                    onClick={() => handleMoodSelect(mood)}
                    className="flex items-center justify-between w-full px-5 py-4 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200 hover:scale-[1.02] group"
                  >
                    <span className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-olive" />
                      <span className="font-medium">{mood}</span>
                    </span>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-olive transition-colors" />
                  </button>
                ))}
              </div>

              {/* Back button */}
              <button
                onClick={handleBack}
                className="w-full mt-4 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Torna indietro
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScappaWizard;
