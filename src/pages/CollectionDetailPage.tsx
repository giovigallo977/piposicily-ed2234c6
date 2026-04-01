import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronsLeft, Loader2, Star, MapPin } from "lucide-react";
import { useCollectionById, useCollectionHotspots } from "@/hooks/useCollections";
import { useHotspots } from "@/hooks/useHotspots";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCardGate } from "@/hooks/useCardGate";
import { useTranslatedContent } from "@/hooks/useTranslation";
import ItineraryStageCard from "@/components/ItineraryStageCard";
import EmailGateModal from "@/components/EmailGateModal";
import CollectionInlineBlock from "@/components/CollectionInlineBlock";

const RatingRow = ({ label, value }: { label: string; value: number }) => (
  <div className="flex items-center justify-between gap-3">
    <span className="text-sm text-foreground">{label}</span>
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i <= value ? "fill-primary text-primary" : "text-muted-foreground/30"}`}
        />
      ))}
    </div>
  </div>
);

const CollectionDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { data: collection, isLoading: collLoading } = useCollectionById(id);
  const { data: collectionHotspots, isLoading: chLoading } = useCollectionHotspots(id);
  const { data: allHotspots, isLoading: hLoading } = useHotspots();
  const {
    shouldShowCollectionBlock,
    onBeforeExpand,
    gateModalOpen,
    setGateModalOpen,
    onEmailProvided,
    gateSource,
  } = useCardGate();

  const { translatedText: translatedDesc } = useTranslatedContent(collection?.descrizione);

  const hotspots = useMemo(() => {
    if (!collectionHotspots || !allHotspots) return [];
    const idOrder = collectionHotspots.map(ch => ch.hotspot_id);
    return idOrder
      .map(hid => allHotspots.find(h => h.id === hid))
      .filter(Boolean) as typeof allHotspots;
  }, [collectionHotspots, allHotspots]);

  const isLoading = collLoading || chLoading || hLoading;

  const visibleCount = shouldShowCollectionBlock
    ? Math.max(1, Math.ceil(hotspots.length * 0.25))
    : hotspots.length;

  const visibleHotspots = hotspots.slice(0, visibleCount);

  // Collage photos from hotspots
  const collagePhotos = useMemo(() => {
    return hotspots
      .map(h => h.foto_principale)
      .filter(Boolean)
      .slice(0, 5) as string[];
  }, [hotspots]);

  const hasRatings = collection && (
    (collection.rating_turistico ?? 0) > 0 ||
    (collection.rating_relax ?? 0) > 0 ||
    (collection.rating_natura ?? 0) > 0 ||
    (collection.rating_sforzo ?? 0) > 0 ||
    (collection.rating_cultura ?? 0) > 0
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background py-4 px-6 flex items-center justify-between border-b border-border">
        <button onClick={() => navigate("/collezioni")} className="p-2 transition-all duration-200 hover:scale-110" aria-label={t("backLabel")}>
          <ChevronsLeft className="w-8 h-8 text-foreground" strokeWidth={2.5} />
        </button>
        <h1 className="font-sans text-xl font-bold text-foreground truncate max-w-[60%]">
          {collection?.nome || t("collection")}
        </h1>
        <div className="w-10" />
      </header>

      <main className="container mx-auto px-4 py-0 pb-24">
        <div className="max-w-5xl mx-auto">
          {isLoading && (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {/* Hero Collage */}
          {!isLoading && collagePhotos.length > 0 && (
            <div className="w-full grid grid-cols-4 grid-rows-2 gap-1 h-[250px] md:h-[350px] overflow-hidden rounded-b-xl">
              {/* Main large photo */}
              <div className="col-span-2 row-span-2">
                <img src={collagePhotos[0]} alt="" className="w-full h-full object-cover" />
              </div>
              {/* Smaller photos */}
              {collagePhotos.slice(1, 5).map((foto, i) => (
                <div key={i} className="col-span-1 row-span-1">
                  <img src={foto} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
              {/* Fill empty slots */}
              {collagePhotos.length < 5 &&
                Array.from({ length: Math.max(0, 4 - (collagePhotos.length - 1)) }).map((_, i) => (
                  <div key={`empty-${i}`} className="col-span-1 row-span-1 bg-muted" />
                ))
              }
            </div>
          )}

          {/* Ratings section */}
          {!isLoading && hasRatings && (
            <div className="px-2 py-5 border-b border-border">
              <h2 className="font-sans font-bold text-base text-foreground mb-3">
                Questo itinerario fa per me?
              </h2>
              <div className="space-y-2">
                <RatingRow label="Itinerario turistico" value={collection!.rating_turistico ?? 0} />
                <RatingRow label="Relax" value={collection!.rating_relax ?? 0} />
                <RatingRow label="Natura e avventura" value={collection!.rating_natura ?? 0} />
                <RatingRow label="Sforzo fisico" value={collection!.rating_sforzo ?? 0} />
                <RatingRow label="Tipo di itinerario" value={collection!.rating_tipo ?? 0} />
              </div>
            </div>
          )}

          {/* Description */}
          {!isLoading && translatedDesc && (
            <div className="px-2 py-5 border-b border-border">
              <p className="text-sm text-foreground leading-relaxed">{translatedDesc}</p>
            </div>
          )}

          {/* Two-column layout: stages + map */}
          {!isLoading && hotspots.length > 0 && (
            <div className="flex flex-col lg:flex-row gap-6 mt-2">
              {/* Left: itinerary stages */}
              <div className="flex-1 min-w-0">
                {visibleHotspots.map((hotspot, index) => (
                  <ItineraryStageCard
                    key={hotspot.id}
                    hotspot={hotspot}
                    stageNumber={index + 1}
                    onBeforeExpand={onBeforeExpand}
                  />
                ))}

                {shouldShowCollectionBlock && hotspots.length > visibleCount && (
                  <CollectionInlineBlock onContinue={() => setGateModalOpen(true)} />
                )}
              </div>

              {/* Right: map sidebar (desktop) */}
              {collection?.mappa_immagine && (
                <aside className="w-full lg:w-[300px] flex-shrink-0 lg:sticky lg:top-20 lg:self-start">
                  <div className="rounded-xl overflow-hidden border border-border shadow-sm">
                    {collection.mappa_link ? (
                      <a href={collection.mappa_link} target="_blank" rel="noopener noreferrer">
                        <img
                          src={collection.mappa_immagine}
                          alt="Mappa itinerario"
                          className="w-full object-cover hover:opacity-90 transition-opacity"
                        />
                        <div className="p-3 flex items-center gap-2 text-sm font-semibold text-primary">
                          <MapPin className="w-4 h-4" />
                          Apri itinerario su Maps
                        </div>
                      </a>
                    ) : (
                      <img
                        src={collection.mappa_immagine}
                        alt="Mappa itinerario"
                        className="w-full object-cover"
                      />
                    )}
                  </div>
                </aside>
              )}
            </div>
          )}

          {!isLoading && hotspots.length === 0 && (
            <div className="text-center py-12 text-muted-foreground font-sans italic">
              <p>{t("noHotspotsCollection")}</p>
            </div>
          )}
        </div>
      </main>

      <EmailGateModal open={gateModalOpen} onOpenChange={setGateModalOpen} onEmailProvided={onEmailProvided} source={gateSource} />
    </div>
  );
};

export default CollectionDetailPage;
