import { useState, useCallback, useEffect } from "react";
import { Plus, Minus, Navigation, X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Hotspot } from "@/hooks/useHotspots";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslatedHotspot } from "@/hooks/useTranslation";
import useEmblaCarousel from "embla-carousel-react";

interface HotspotCardProps {
  hotspot: Hotspot;
}

const HotspotCard = ({ hotspot }: HotspotCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const { t } = useLanguage();

  const { translated, isTranslating } = useTranslatedHotspot({
    titolo: hotspot.titolo,
    descrizione_breve: hotspot.descrizione_breve,
    descrizione_completa: hotspot.descrizione_completa,
    categoria: hotspot.categoria,
  });

  const [emblaRef, emblaApi] = useEmblaCarousel({ startIndex: currentPhotoIndex });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  // Sync carousel when lightbox opens
  useEffect(() => {
    if (emblaApi && lightboxOpen) {
      emblaApi.scrollTo(currentPhotoIndex, true);
    }
  }, [emblaApi, lightboxOpen, currentPhotoIndex]);

  const openLightbox = (index: number) => {
    setCurrentPhotoIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const validGalleryPhotos = hotspot.foto_gallery?.filter(Boolean) || [];

  return (
    <>
      <article className={cn(
        "bg-card rounded-3xl overflow-hidden shadow-lg shadow-olive/10 border border-mint transition-all duration-200",
        isTranslating && "opacity-75"
      )}>
        {/* Immagine principale */}
        <div className="aspect-[4/3] bg-muted overflow-hidden">
          {hotspot.foto_principale ? (
            <img
              src={hotspot.foto_principale}
              alt={translated.titolo}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <span className="text-muted-foreground text-sm">{t("photo")}</span>
            </div>
          )}
        </div>

        {/* Contenuto */}
        <div className="p-5">
          {/* Header con titolo e bottone espansione */}
          <div className="flex items-start justify-between gap-4">
            <h2 className="font-heading text-xl font-bold text-foreground leading-tight flex-1 min-w-0">
              {translated.titolo}
            </h2>
            
            {/* Categoria e bottone espansione */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {translated.categoria && (
                <span className="px-3 py-1.5 bg-lavender text-foreground text-xs font-semibold rounded-full">
                  {translated.categoria}
                </span>
              )}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-10 h-10 rounded-full bg-olive flex items-center justify-center transition-all duration-200 hover:bg-olive/80 hover:scale-110 hover:shadow-lg hover:shadow-olive/30"
                aria-expanded={isExpanded}
                aria-label={isExpanded ? t("hideDetails") : t("showDetails")}
              >
                {isExpanded ? (
                  <Minus className="w-5 h-5 text-olive-foreground" />
                ) : (
                  <Plus className="w-5 h-5 text-olive-foreground" />
                )}
              </button>
            </div>
          </div>

          {/* Riga Tag */}
          {hotspot.tags && hotspot.tags.length > 0 && (
            <p className="mt-1 font-body text-sm text-foreground">
              {hotspot.tags.map((tag, i) => (
                <span key={i}>• {tag} </span>
              ))}
            </p>
          )}

          {/* Descrizione breve - riga orizzontale completa */}
          <p className="mt-2 font-body text-sm text-foreground leading-relaxed">
            {translated.descrizione_breve}
          </p>

          {/* Contenuto espanso con accordion */}
          <div
            className={cn(
              "grid transition-all duration-300 ease-out",
              isExpanded ? "grid-rows-[1fr] opacity-100 mt-5" : "grid-rows-[0fr] opacity-0"
            )}
          >
            <div className="overflow-hidden">
              {/* Descrizione completa */}
                <p className="font-body text-sm text-foreground leading-relaxed whitespace-pre-line">
                  {translated.descrizione_completa}
                </p>

              {/* Link Naviga - usa <a> per mobile compatibility */}
              {hotspot.link_google_maps && (
                <a
                  href={hotspot.link_google_maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 px-5 py-3 bg-olive text-olive-foreground rounded-full font-brand font-black italic text-sm transition-all duration-200 hover:bg-olive/90 hover:scale-105 hover:shadow-lg hover:shadow-olive/30"
                >
                  <span className="text-base">👽</span>
                  <Navigation className="w-4 h-4" />
                  {t("meetPipo")}
                </a>
              )}

              {/* Galleria foto */}
              {validGalleryPhotos.length > 0 && (
                <div className="mt-5 grid grid-cols-3 gap-2.5">
                  {validGalleryPhotos.map((foto, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded-2xl overflow-hidden bg-muted cursor-pointer transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
                      onClick={() => openLightbox(index)}
                    >
                      <img
                        src={foto}
                        alt={`${translated.titolo} - ${t("photo")} ${index + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </article>

      {/* Lightbox */}
      {lightboxOpen && validGalleryPhotos.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center animate-fade-in"
          onClick={closeLightbox}
        >
          {/* Pulsante chiudi */}
          <button
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            onClick={closeLightbox}
            aria-label={t("close")}
          >
            <X className="w-6 h-6" />
          </button>

          {/* Carousel container */}
          <div
            className="w-full h-full flex items-center justify-center px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="overflow-hidden w-full max-w-4xl" ref={emblaRef}>
              <div className="flex">
                {validGalleryPhotos.map((foto, index) => (
                  <div
                    key={index}
                    className="flex-[0_0_100%] min-w-0 flex items-center justify-center"
                  >
                    <img
                      src={foto}
                      alt={`${translated.titolo} - ${t("photo")} ${index + 1}`}
                      className="max-h-[80vh] max-w-full object-contain rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Frecce navigazione */}
            {validGalleryPhotos.length > 1 && (
              <>
                <button
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                  onClick={scrollPrev}
                  aria-label={t("previousPhoto")}
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                  onClick={scrollNext}
                  aria-label={t("nextPhoto")}
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Indicatori pallini */}
          {validGalleryPhotos.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {validGalleryPhotos.map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    index === currentPhotoIndex ? "bg-white" : "bg-white/40"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentPhotoIndex(index);
                    emblaApi?.scrollTo(index);
                  }}
                  aria-label={`${t("goToPhoto")} ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default HotspotCard;
