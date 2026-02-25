import { useParams, useNavigate } from "react-router-dom";
import { ChevronsLeft } from "lucide-react";
import { useCollectionById, useCollectionHotspots } from "@/hooks/useCollections";
import { useHotspots } from "@/hooks/useHotspots";
import { useLanguage } from "@/contexts/LanguageContext";
import HotspotCard from "@/components/HotspotCard";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";

const CollectionDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { data: collection, isLoading: collLoading } = useCollectionById(id);
  const { data: collectionHotspots, isLoading: chLoading } = useCollectionHotspots(id);
  const { data: allHotspots, isLoading: hLoading } = useHotspots();

  const hotspots = useMemo(() => {
    if (!collectionHotspots || !allHotspots) return [];
    const idOrder = collectionHotspots.map(ch => ch.hotspot_id);
    return idOrder
      .map(hid => allHotspots.find(h => h.id === hid))
      .filter(Boolean) as typeof allHotspots;
  }, [collectionHotspots, allHotspots]);

  const isLoading = collLoading || chLoading || hLoading;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background py-4 px-6 flex items-center justify-between">
        <button onClick={() => navigate("/collezioni")} className="p-2 transition-all duration-200 hover:scale-110" aria-label={t("backLabel")}>
          <ChevronsLeft className="w-8 h-8 text-foreground" strokeWidth={2.5} />
        </button>
        <h1 className="font-sans text-xl font-bold text-foreground truncate max-w-[60%]">
          {collection?.nome || t("collection")}
        </h1>
        <div className="w-12" />
      </header>

      <main className="container mx-auto px-4 py-6 pb-24">
        <div className="max-w-6xl mx-auto">
          {isLoading && (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotspots.map((hotspot, index) => (
              <HotspotCard key={hotspot.id} hotspot={hotspot} index={index} />
            ))}
          </div>

          {!isLoading && hotspots.length === 0 && (
            <div className="text-center py-12 text-muted-foreground font-sans italic">
              <p>{t("noHotspotsCollection")}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CollectionDetailPage;
