import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronsLeft, Filter, Sparkles } from "lucide-react";
import HotspotCard from "@/components/HotspotCard";
import PremiumModal from "@/components/PremiumModal";
import { useHotspots } from "@/hooks/useHotspots";
import { useHotspotCategories } from "@/hooks/useSiteContent";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslatedCategories } from "@/hooks/useTranslatedCategories";
import { usePremiumStatus } from "@/hooks/usePremiumStatus";
import { Loader2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const ExplorePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data: hotspots, isLoading, error } = useHotspots();
  const { data: categories = [] } = useHotspotCategories();
  const { t } = useLanguage();
  const { translatedCategories } = useTranslatedCategories(categories);
  const { isPremium } = usePremiumStatus();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [premiumModalOpen, setPremiumModalOpen] = useState(false);

  const categoriaParam = searchParams.get("categoria");

  // Track first hotspot per category
  const firstPerCategory = useMemo(() => {
    if (!hotspots) return new Set<string>();
    const seen = new Map<string, string>();
    const sorted = [...hotspots].sort((a, b) => (a.ordine ?? 0) - (b.ordine ?? 0));
    for (const h of sorted) {
      const cat = h.categoria || "__none__";
      if (!seen.has(cat)) seen.set(cat, h.id);
    }
    return new Set(seen.values());
  }, [hotspots]);

  const filteredHotspots = useMemo(() => {
    if (!hotspots) return [];
    let result = hotspots;
    if (categoriaParam) {
      result = result.filter(h => h.categoria === categoriaParam);
    }
    if (selectedCategory) {
      result = result.filter(h => h.categoria === selectedCategory);
    }
    return result;
  }, [hotspots, categoriaParam, selectedCategory]);

  const totalCards = hotspots?.length ?? 0;
  const freeCards = firstPerCategory.size;

  const handleBack = () => navigate("/");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background py-4 px-6 flex items-center justify-between">
        <button onClick={handleBack} className="p-2 transition-all duration-200 hover:scale-110" aria-label={t("backLabel")}>
          <ChevronsLeft className="w-8 h-8 text-foreground" strokeWidth={2.5} />
        </button>
        
        <div className="flex items-center gap-2">
          <img alt="Pipo" className="h-10 w-10 object-contain" draggable={false} src="/lovable-uploads/c09259c8-f4e2-4940-b26d-61c1f4a134ae.png" />
          {isPremium && (
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-olive text-olive-foreground">
              {t("premiumMember")}
            </span>
          )}
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 transition-all duration-200 hover:scale-110" aria-label={t("filter")}>
              <Filter className="w-6 h-6 text-foreground" strokeWidth={2} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-background border border-border">
            <DropdownMenuItem onClick={() => setSelectedCategory(null)} className={`cursor-pointer font-sans ${!selectedCategory ? "bg-muted" : ""}`}>
              {t("allCategories")}
            </DropdownMenuItem>
            {categories.map((category, index) => (
              <DropdownMenuItem key={category} onClick={() => setSelectedCategory(category)} className={`cursor-pointer font-sans ${selectedCategory === category ? "bg-muted" : ""}`}>
                {translatedCategories[index] || category}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Premium banner */}
      {!isPremium && totalCards > 0 && (
        <div
          className="mx-4 mb-4 p-3 rounded-2xl bg-muted flex items-center justify-between cursor-pointer hover:bg-accent transition-colors"
          onClick={() => setPremiumModalOpen(true)}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-olive" />
            <span className="text-sm font-medium">
              {freeCards}/{totalCards} {t("cardsAvailable")}
            </span>
          </div>
          <span className="text-xs font-bold text-olive">{t("unlockAll")}</span>
        </div>
      )}

      {/* Active filters */}
      {selectedCategory && (
        <div className="px-6 py-2 flex flex-wrap gap-2 justify-center">
          <button onClick={() => setSelectedCategory(null)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-foreground text-background font-sans">
            {selectedCategory}
            <span className="ml-1">×</span>
          </button>
        </div>
      )}

      {/* Content */}
      <main className="container mx-auto px-4 py-6 pb-24">
        <div className="max-w-6xl mx-auto">
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHotspots.map((hotspot, index) => {
              const isFreeCard = firstPerCategory.has(hotspot.id);
              const isLocked = !isPremium && !isFreeCard;
              return (
                <HotspotCard
                  key={hotspot.id}
                  hotspot={hotspot}
                  index={index}
                  locked={isLocked}
                  isFree={!isPremium ? isFreeCard : false}
                  onLockedClick={() => setPremiumModalOpen(true)}
                />
              );
            })}
          </div>
          
          {!isLoading && filteredHotspots.length === 0 && hotspots && hotspots.length > 0 && (
            <div className="text-center py-12 text-muted-foreground font-sans italic">
              <p>{t("noHotspotsCategory")}</p>
            </div>
          )}
          
          {!isLoading && hotspots?.length === 0 && (
            <div className="text-center py-12 text-muted-foreground font-sans italic">
              <p>{t("noHotspots")}</p>
            </div>
          )}
        </div>
      </main>

      <PremiumModal open={premiumModalOpen} onOpenChange={setPremiumModalOpen} />
    </div>
  );
};

export default ExplorePage;
