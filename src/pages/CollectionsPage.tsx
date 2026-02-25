import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronsLeft, LogIn, Loader2 } from "lucide-react";
import { useCollections } from "@/hooks/useCollections";
import { useFreeSpots } from "@/hooks/useFreeSpots";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import PremiumModal from "@/components/PremiumModal";
import HotspotCard from "@/components/HotspotCard";
import type { Hotspot } from "@/hooks/useHotspots";

const FREE_SPOT_FILTERS = ["Tutti", "Lavorare", "Studiare", "Eat & Drink"];

const CollectionsPage = () => {
  const navigate = useNavigate();
  const { data: collections, isLoading } = useCollections();
  const { data: freeSpots, isLoading: freeSpotsLoading } = useFreeSpots();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [premiumModalOpen, setPremiumModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Tutti");

  const filteredSpots = freeSpots?.filter((spot) =>
    activeFilter === "Tutti" ? true : spot.categoria === activeFilter
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background py-4 px-6 flex items-center justify-between">
        <button onClick={() => navigate("/")} className="p-2 transition-all duration-200 hover:scale-110" aria-label={t("backLabel")}>
          <ChevronsLeft className="w-8 h-8 text-foreground" strokeWidth={2.5} />
        </button>
        <h1 className="font-sans text-xl font-bold text-foreground">{t("collections")}</h1>
        {!user ? (
          <button onClick={() => setPremiumModalOpen(true)} className="p-2 transition-all duration-200 hover:scale-110" aria-label="Login">
            <LogIn className="w-6 h-6 text-foreground" />
          </button>
        ) : (
          <div className="w-12" />
        )}
      </header>

      <main className="container mx-auto px-4 py-6 pb-24">
        <div className="max-w-lg mx-auto">
          {isLoading && (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            {collections?.map((collection) => (
              <button
                key={collection.id}
                onClick={() => navigate(`/collezioni/${collection.id}`)}
                className="relative aspect-square rounded-2xl overflow-hidden group focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {collection.immagine ? (
                  <img
                    src={collection.immagine}
                    alt={collection.nome}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-muted" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <span className="absolute bottom-3 left-3 right-3 text-white font-sans text-sm md:text-base font-bold text-left leading-tight drop-shadow-lg">
                  {collection.nome}
                </span>
              </button>
            ))}
          </div>

          {!isLoading && collections?.length === 0 && (
            <div className="text-center py-12 text-muted-foreground font-sans italic">
              <p>{t("noCollections")}</p>
            </div>
          )}

          {/* Sezione Free Spots */}
          {(freeSpots && freeSpots.length > 0) && (
            <section className="mt-10">
              <h2 className="font-sans text-lg font-bold text-foreground mb-4">
                Posti per: Lavorare, Studiare e Eat & Drink
              </h2>

              {/* Filtri chip */}
              <div className="flex flex-wrap gap-2 mb-6">
                {FREE_SPOT_FILTERS.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                      activeFilter === filter
                        ? "bg-foreground text-background"
                        : "bg-muted text-foreground hover:bg-muted/80"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {freeSpotsLoading && (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              )}

              <div className="space-y-6">
                {filteredSpots?.map((spot, index) => (
                  <HotspotCard
                    key={spot.id}
                    hotspot={spot as unknown as Hotspot}
                    index={index}
                    locked={false}
                  />
                ))}
              </div>

              {!freeSpotsLoading && filteredSpots?.length === 0 && (
                <p className="text-center py-8 text-muted-foreground font-sans italic text-sm">
                  Nessun posto in questa categoria.
                </p>
              )}
            </section>
          )}
        </div>
      </main>
      <PremiumModal open={premiumModalOpen} onOpenChange={setPremiumModalOpen} />
    </div>
  );
};

export default CollectionsPage;
