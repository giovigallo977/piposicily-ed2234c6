import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronsLeft, Sparkles, Loader2 } from "lucide-react";
import HotspotCard from "@/components/HotspotCard";
import PremiumModal from "@/components/PremiumModal";
import { useHotspots } from "@/hooks/useHotspots";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePremiumStatus } from "@/hooks/usePremiumStatus";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

const ExplorePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data: hotspots, isLoading, error } = useHotspots();
  const { t, language } = useLanguage();
  const { isPremium } = usePremiumStatus();
  const { user, signOut } = useAuth();

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
    if (categoriaParam) {
      return hotspots.filter(h => h.categoria === categoriaParam);
    }
    return hotspots;
  }, [hotspots, categoriaParam]);

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
        {!user ? (
          <button onClick={() => setPremiumModalOpen(true)} className="text-sm font-medium text-foreground hover:opacity-70 transition-opacity">
            Login
          </button>
        ) : (
          <button onClick={async () => { await signOut(); toast({ title: language === "it" ? "Sei uscito" : "Logged out" }); }} className="text-sm font-medium text-foreground hover:opacity-70 transition-opacity">
            Logout
          </button>
        )}
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
