import { useState } from "react";
import { X, MapPin, Clock, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
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
  onResult: (zone: string | null, mood: string | null) => void;
}

const ScappaWizard = ({ open, onOpenChange, zones, moods, onResult }: ScappaWizardProps) => {
  const [step, setStep] = useState(1);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const { t } = useLanguage();

  const handleZoneSelect = (zone: string) => {
    setSelectedZone(zone);
    setStep(2);
  };

  const handleMoodSelect = (mood: string | null) => {
    setSelectedMood(mood);
    onResult(selectedZone, mood);
    handleClose();
  };

  const handleClose = () => {
    setStep(1);
    setSelectedZone(null);
    setSelectedMood(null);
    onOpenChange(false);
  };

  const handleSkipMood = () => {
    onResult(selectedZone, null);
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-background border-0 rounded-3xl shadow-2xl p-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 text-center bg-olive">
          <DialogTitle className="text-white font-sans font-bold text-xl flex items-center justify-center gap-2">
            <span className="text-2xl">👽</span>
            Scappa in 30 secondi
          </DialogTitle>
          <p className="text-white/90 text-sm mt-1">
            {step === 1 ? "Dove vuoi andare?" : "Che mood cerchi?"}
          </p>
        </DialogHeader>

        {/* Step indicator */}
        <div className="flex justify-center gap-2 py-3">
          <div 
            className={`w-2 h-2 rounded-full transition-all ${step === 1 ? 'bg-olive w-6' : 'bg-gray-300'}`} 
          />
          <div 
            className={`w-2 h-2 rounded-full transition-all ${step === 2 ? 'bg-olive w-6' : 'bg-gray-300'}`} 
          />
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          {step === 1 && (
            <div className="space-y-3">
              <p className="text-center text-sm text-muted-foreground mb-4">
                Seleziona la zona che vuoi esplorare
              </p>
              {zones.length > 0 ? (
                <div className="grid gap-3">
                  {zones.map((zone) => (
                    <button
                      key={zone}
                      onClick={() => handleZoneSelect(zone)}
                      className="flex items-center justify-between w-full px-5 py-4 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-all duration-200 hover:scale-[1.02] group"
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
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <p className="text-center text-sm text-muted-foreground mb-4">
                Scegli un mood o mostra tutto
              </p>
              <div className="grid gap-3 max-h-64 overflow-y-auto">
                {/* Show all option */}
                <button
                  onClick={handleSkipMood}
                  className="flex items-center justify-between w-full px-5 py-4 rounded-2xl transition-all duration-200 hover:scale-[1.02] group bg-olive"
                >
                  <span className="flex items-center gap-3 text-white">
                    <span className="text-xl">🎲</span>
                    <span className="font-semibold">Mostra tutto</span>
                  </span>
                  <ArrowRight className="w-5 h-5 text-white/80" />
                </button>

                {moods.map((mood) => (
                  <button
                    key={mood}
                    onClick={() => handleMoodSelect(mood)}
                    className="flex items-center justify-between w-full px-5 py-4 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-all duration-200 hover:scale-[1.02] group"
                  >
                    <span className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-olive" />
                      <span className="font-medium">{mood}</span>
                    </span>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-olive transition-colors" />
                  </button>
                ))}
              </div>

              {/* Back button */}
              <button
                onClick={() => setStep(1)}
                className="w-full mt-4 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Torna indietro
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScappaWizard;
