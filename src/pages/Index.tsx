import { useState, useMemo } from "react";
import Header from "@/components/Header";
import HotspotCard from "@/components/HotspotCard";
import { useHotspots } from "@/hooks/useHotspots";
import { useHotspotCategories } from "@/hooks/useSiteContent";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { data: hotspots, isLoading, error } = useHotspots();
  const { data: categories = [] } = useHotspotCategories();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredHotspots = useMemo(() => {
    if (!hotspots) return [];
    if (!selectedCategory) return hotspots;
    return hotspots.filter((h) => h.categoria === selectedCategory);
  }, [hotspots, selectedCategory]);

  return (
    <div className="min-h-screen bg-background">
      <Header 
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
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
              <p>Errore nel caricamento degli hotspot.</p>
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
              <p>Nessun hotspot in questa categoria.</p>
            </div>
          )}
          
          {!isLoading && hotspots?.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>Nessun hotspot disponibile.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
