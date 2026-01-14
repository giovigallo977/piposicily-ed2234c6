import { useState, useMemo } from "react";
import Header from "@/components/Header";
import HotspotCard from "@/components/HotspotCard";
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
  const { t } = useLanguage();

  const filteredHotspots = useMemo(() => {
    if (!hotspots) return [];
    if (!selectedCategory) return hotspots;
    return hotspots.filter((h) => h.categoria === selectedCategory);
  }, [hotspots, selectedCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-mint via-background to-background">
      <Header 
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        headerTitle={headerTitleContent?.content}
        headerSubtitle={headerSubtitleContent?.content}
      />
      
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
          
          {filteredHotspots.map((hotspot) => (
            <HotspotCard 
              key={hotspot.id} 
              hotspot={hotspot} 
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
