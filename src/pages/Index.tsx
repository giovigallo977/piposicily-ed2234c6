import { useState, useMemo } from "react";
import MinimalHeader from "@/components/MinimalHeader";
import HeroSection from "@/components/HeroSection";
import HotspotCard from "@/components/HotspotCard";
import ScappaWizard from "@/components/ScappaWizard";
import { useHotspots } from "@/hooks/useHotspots";
import { useHotspotCategories } from "@/hooks/useSiteContent";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslatedCategories } from "@/hooks/useTranslatedCategories";
import { Loader2, Filter, ArrowLeft } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Index = () => {
  const { data: hotspots, isLoading, error } = useHotspots();
  const { data: categories = [] } = useHotspotCategories();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [showHotspots, setShowHotspots] = useState(false);
  const { t } = useLanguage();
  const { translatedCategories, getTranslatedCategory } = useTranslatedCategories(categories);

  // Extract unique zones from hotspots
  const zones = useMemo(() => {
    if (!hotspots) return [];
    const uniqueZones = [...new Set(hotspots.map(h => h.zona).filter(Boolean))];
    return uniqueZones as string[];
  }, [hotspots]);

  // Extract unique moods (tags) from hotspots
  const moods = useMemo(() => {
    if (!hotspots) return [];
    const allTags = hotspots.flatMap(h => h.tags || []).filter(Boolean);
    const uniqueTags = [...new Set(allTags)];
    return uniqueTags as string[];
  }, [hotspots]);

  const filteredHotspots = useMemo(() => {
    if (!hotspots) return [];
    let result = hotspots;
    
    if (selectedZone) {
      result = result.filter((h) => h.zona === selectedZone);
    }
    if (selectedCategory) {
      result = result.filter((h) => h.categoria === selectedCategory);
    }
    if (selectedMood) {
      result = result.filter((h) => h.tags?.includes(selectedMood));
    }
    
    return result;
  }, [hotspots, selectedCategory, selectedZone, selectedMood]);

  const handleWizardResult = (zone: string | null, mood: string | null, exploreAll?: boolean) => {
    if (exploreAll) {
      setSelectedZone(null);
      setSelectedMood(null);
      setSelectedCategory(null);
    } else {
      setSelectedZone(zone);
      setSelectedMood(mood);
    }
    setShowHotspots(true);
  };

  const handleOpenWizard = () => {
    setWizardOpen(true);
  };

  const handleBackToHome = () => {
    setSelectedZone(null);
    setSelectedCategory(null);
    setSelectedMood(null);
    setShowHotspots(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <MinimalHeader />
      
      {!showHotspots && (
        <HeroSection onCtaClick={handleOpenWizard} />
      )}

      <ScappaWizard
        open={wizardOpen}
        onOpenChange={setWizardOpen}
        zones={zones}
        moods={moods}
        onResult={handleWizardResult}
      />
      
      {/* Sticky bar when showing hotspots */}
      {showHotspots && (
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/30 shadow-sm">
          <div className="container mx-auto px-4 py-3">
            <div className="max-w-lg mx-auto flex items-center justify-between">
              {/* Back button */}
              <button
                onClick={handleBackToHome}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Home
              </button>

              {/* Active filters */}
              <div className="flex items-center gap-2 flex-wrap justify-center flex-1 mx-4">
                {selectedZone && (
                  <button
                    onClick={() => setSelectedZone(null)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-olive text-white"
                  >
                    📍 {selectedZone}
                    <span className="ml-1">×</span>
                  </button>
                )}
                {selectedMood && (
                  <button
                    onClick={() => setSelectedMood(null)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-olive text-white"
                  >
                    🎭 {selectedMood}
                    <span className="ml-1">×</span>
                  </button>
                )}
                {selectedCategory && (
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-black text-white"
                  >
                    {selectedCategory}
                    <span className="ml-1">×</span>
                  </button>
                )}
              </div>

              {/* Category filter dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="p-2 rounded-full transition-all duration-200 hover:scale-110 bg-transparent"
                    aria-label={t("filter")}
                  >
                    <Filter className="w-5 h-5 text-black" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-background border border-border">
                  <DropdownMenuItem
                    onClick={() => setSelectedCategory(null)}
                    className={`cursor-pointer ${!selectedCategory ? "bg-muted" : ""}`}
                  >
                    {t("allCategories")}
                  </DropdownMenuItem>
                  {categories.map((category, index) => (
                    <DropdownMenuItem
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`cursor-pointer ${selectedCategory === category ? "bg-muted" : ""}`}
                    >
                      {translatedCategories[index] || category}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      )}
      
      {showHotspots && (
        <main className="container mx-auto px-4 py-6">
          <div className="max-w-lg mx-auto space-y-6">
            {isLoading && (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            
            {error && (
              <div className="text-center py-12 text-muted-foreground">
                <p>{t("loadingHotspotsError")}</p>
              </div>
            )}
            
            {filteredHotspots.map((hotspot, index) => (
              <HotspotCard 
                key={hotspot.id} 
                hotspot={hotspot}
                index={index}
              />
            ))}
            
            {!isLoading && filteredHotspots.length === 0 && hotspots && hotspots.length > 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p>{t("noHotspotsCategory")}</p>
              </div>
            )}
            
            {!isLoading && hotspots?.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p>{t("noHotspots")}</p>
              </div>
            )}
          </div>
        </main>
      )}
    </div>
  );
};

export default Index;
