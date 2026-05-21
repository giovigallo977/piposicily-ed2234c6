import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { useLocation } from "react-router-dom";
import HotspotCard from "@/components/HotspotCard";
import EmailGateModal from "@/components/EmailGateModal";
import SiteHeader from "@/components/SiteHeader";
import { useHotspots, type Hotspot } from "@/hooks/useHotspots";
import { useFreeSpots } from "@/hooks/useFreeSpots";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCardGate } from "@/hooks/useCardGate";

type Filter =
  | "all"
  | "Luoghi Fantasma"
  | "Natura"
  | "Borghi"
  | "Arte e Cultura"
  | "free-spots";

const MagazineHome = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    const incoming = (location.state as { filter?: string } | null)?.filter;
    if (incoming) setFilter(incoming as Filter);
  }, [location.state]);

  const { data: hotspots, isLoading: loadingHotspots } = useHotspots();
  const { data: freeSpots, isLoading: loadingFree } = useFreeSpots();
  const { onBeforeExpand, gateModalOpen, setGateModalOpen, onEmailProvided, gateSource } = useCardGate();

  const items = useMemo<Hotspot[]>(() => {
    if (filter === "free-spots") return (freeSpots || []) as unknown as Hotspot[];
    if (filter === "all") return (hotspots || []).filter(h => h.categoria !== "Free Spots");
    return (hotspots || []).filter(h => h.categoria === filter);
  }, [filter, hotspots, freeSpots]);

  const isLoading = filter === "free-spots" ? loadingFree : loadingHotspots;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader activeFilter={filter} onFilterClick={(k) => setFilter(k as Filter)} />

      <main className="px-6 md:px-12 py-10 md:py-14 pb-24">
        {isLoading && (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-foreground/60" />
          </div>
        )}

        {!isLoading && items.length === 0 && (
          <p className="text-center py-20 text-muted-foreground font-sans italic">
            {filter === "free-spots" ? t("noFreeSpots") : t("noHotspotsCategory")}
          </p>
        )}

        {!isLoading && items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {items.map((hotspot, i) => (
              <HotspotCard
                key={hotspot.id}
                hotspot={hotspot}
                index={i}
                onBeforeExpand={filter === "free-spots" ? undefined : onBeforeExpand}
              />
            ))}
          </div>
        )}
      </main>

      <EmailGateModal open={gateModalOpen} onOpenChange={setGateModalOpen} onEmailProvided={onEmailProvided} source={gateSource} />
    </div>
  );
};

export default MagazineHome;
