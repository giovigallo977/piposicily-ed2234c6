import { useState, useMemo } from "react";
import Header from "@/components/Header";
import HotspotCard from "@/components/HotspotCard";
import ScappaWizard from "@/components/ScappaWizard";
import { useHotspots } from "@/hooks/useHotspots";
import { useHotspotCategories, useSiteContent } from "@/hooks/useSiteContent";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { data: hotspots, isLoading, error } = useHotspots();
  const { data: categories = [] } = useHotspotCategories();
  const { data: headerTitleContent } = useSiteContent("header_title");
  const { data: headerSubtitleContent } = useSiteContent("header_subtitle");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [wizardOpen, setWizardOpen] = useState(false);
  const { t } = useLanguage();

  // Extract unique zones from hotspots
  const zones = useMemo(() => {
    if (!hotspots) return [];
    const uniqueZones = [...new Set(hotspots.map(h => h.zona).filter(Boolean))];
    return uniqueZones as string[];
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
    
    return result;
  }, [hotspots, selectedCategory, selectedZone]);

  const handleWizardResult = (zone: string | null, category: string | null) => {
    setSelectedZone(zone);
    setSelectedCategory(category);
  };

  const handleOpenWizard = () => {
    setWizardOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        headerTitle={headerTitleContent?.content}
        headerSubtitle={headerSubtitleContent?.content}
        onScappaClick={handleOpenWizard}
      />

      <ScappaWizard
        open={wizardOpen}
        onOpenChange={setWizardOpen}
        zones={zones}
        categories={categories}
        onResult={handleWizardResult}
      />
      
      {/* Active filters indicator */}
      {(selectedZone || selectedCategory) && (
        <div className="container mx-auto px-4 py-3">
          <div className="max-w-lg mx-auto flex flex-wrap items-center gap-2">
            {selectedZone && (
              <button
                onClick={() => setSelectedZone(null)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-olive text-white"
              >
                📍 {selectedZone}
                <span className="ml-1">×</span>
              </button>
            )}
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-black text-white"
              >
                {selectedCategory}
                <span className="ml-1">×</span>
              </button>
            )}
            <button
              onClick={() => {
                setSelectedZone(null);
                setSelectedCategory(null);
              }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Rimuovi filtri
            </button>
          </div>
        </div>
      )}
      
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
    </div>
  );
};

export default Index;
