import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronsLeft, Filter } from "lucide-react";
import pipoAlien from "@/assets/pipo-alien-new.png";
import HotspotCard from "@/components/HotspotCard";
import { useHotspots } from "@/hooks/useHotspots";
import { useHotspotCategories, useSiteContent } from "@/hooks/useSiteContent";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslatedCategories } from "@/hooks/useTranslatedCategories";
import { Loader2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
const ExplorePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    data: hotspots,
    isLoading,
    error
  } = useHotspots();
  const {
    data: categories = []
  } = useHotspotCategories();
  const {
    t
  } = useLanguage();
  const {
    translatedCategories
  } = useTranslatedCategories(categories);
  const { data: instagramLinkContent } = useSiteContent("wizard_instagram_link");
  const instagramLink = instagramLinkContent?.content || "#";
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Get filter from URL params
  const zonaParam = searchParams.get("zona");
  const moodParam = searchParams.get("mood");

  // Determine the source step for back navigation
  const getBackDestination = () => {
    if (moodParam) {
      return "/wizard?step=mood";
    } else if (zonaParam) {
      return "/wizard?step=zona";
    }
    return "/wizard";
  };
  const filteredHotspots = useMemo(() => {
    if (!hotspots) return [];
    let result = hotspots;
    if (zonaParam) {
      result = result.filter(h => h.zona === zonaParam);
    }
    if (moodParam) {
      // Check if any tag (trimmed) matches the mood param
      result = result.filter(h => h.tags?.some(tag => tag.trim() === moodParam));
    }
    if (selectedCategory) {
      result = result.filter(h => h.categoria === selectedCategory);
    }
    return result;
  }, [hotspots, zonaParam, moodParam, selectedCategory]);
  const handleBack = () => {
    navigate(getBackDestination());
  };
  return <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background py-4 px-6 flex items-center justify-between">
        <button onClick={handleBack} className="p-2 transition-all duration-200 hover:scale-110" aria-label={t("backLabel")}>
          <ChevronsLeft className="w-8 h-8 text-black" strokeWidth={2.5} />
        </button>
        
        <img alt="Pipo" className="h-10 w-10 object-contain" draggable={false} src="/lovable-uploads/c09259c8-f4e2-4940-b26d-61c1f4a134ae.png" />
        
        {/* Filter button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 transition-all duration-200 hover:scale-110" aria-label={t("filter")}>
              <Filter className="w-6 h-6 text-black" strokeWidth={2} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-background border border-border">
            <DropdownMenuItem onClick={() => setSelectedCategory(null)} className={`cursor-pointer font-sans ${!selectedCategory ? "bg-muted" : ""}`}>
              {t("allCategories")}
            </DropdownMenuItem>
            {categories.map((category, index) => <DropdownMenuItem key={category} onClick={() => setSelectedCategory(category)} className={`cursor-pointer font-sans ${selectedCategory === category ? "bg-muted" : ""}`}>
                {translatedCategories[index] || category}
              </DropdownMenuItem>)}
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Active filters display */}
      {(zonaParam || moodParam || selectedCategory) && <div className="px-6 py-2 flex flex-wrap gap-2 justify-center">
          {zonaParam && <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-olive text-white font-sans">
              📍 {zonaParam}
            </span>}
          {moodParam && <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-olive text-white font-sans">
              🎭 {moodParam}
            </span>}
          {selectedCategory && <button onClick={() => setSelectedCategory(null)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-black text-white font-sans">
              {selectedCategory}
              <span className="ml-1">×</span>
            </button>}
        </div>}

      {/* Content */}
      <main className="container mx-auto px-4 py-6 pb-24">
        <div className="max-w-lg mx-auto space-y-6">
          {isLoading && <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>}
          
          {error && <div className="text-center py-12 text-muted-foreground">
              <p>{t("loadingHotspotsError")}</p>
            </div>}
          
          {filteredHotspots.map((hotspot, index) => <HotspotCard key={hotspot.id} hotspot={hotspot} index={index} />)}
          
          {!isLoading && filteredHotspots.length === 0 && hotspots && hotspots.length > 0 && <div className="text-center py-12 text-muted-foreground font-sans italic">
              <p>{t("noHotspotsCategory")}</p>
            </div>}
          
          {!isLoading && hotspots?.length === 0 && <div className="text-center py-12 text-muted-foreground font-sans italic">
              <p>{t("noHotspots")}</p>
            </div>}
        </div>
      </main>

      {/* Fixed Instagram CTA bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] py-4 px-6">
        <div className="flex justify-center">
          <a
            href={instagramLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-black text-white font-bold rounded-full transition-transform duration-200 hover:scale-105 font-sans"
          >
            {t("wizardInstagramBtn")}
          </a>
        </div>
      </div>
    </div>;
};
export default ExplorePage;