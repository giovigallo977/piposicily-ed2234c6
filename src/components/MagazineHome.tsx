import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { useLocation } from "react-router-dom";
import HotspotCard from "@/components/HotspotCard";
import SiteHeader from "@/components/SiteHeader";
import { useHotspots, type Hotspot } from "@/hooks/useHotspots";
import { useLanguage } from "@/contexts/LanguageContext";

type Filter =
  | "all"
  | "Luoghi Fantasma"
  | "Natura"
  | "Borghi"
  | "Arte e Cultura";

const MagazineHome = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    const incoming = (location.state as { filter?: string } | null)?.filter;
    if (incoming) setFilter(incoming as Filter);
  }, [location.state]);

  const { data: hotspots, isLoading } = useHotspots();

  const items = useMemo<Hotspot[]>(() => {
    if (filter === "all") return hotspots || [];
    return (hotspots || []).filter((h) => h.categoria === filter);
  }, [filter, hotspots]);

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
            {t("noHotspotsCategory")}
          </p>
        )}

        {!isLoading && items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {items.map((hotspot, i) => (
              <HotspotCard key={hotspot.id} hotspot={hotspot} index={i} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MagazineHome;
