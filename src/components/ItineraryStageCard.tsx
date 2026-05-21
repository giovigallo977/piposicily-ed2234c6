import { useState, useCallback, useEffect } from "react";
import { ChevronDown, Map, X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Hotspot } from "@/hooks/useHotspots";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslatedHotspot } from "@/hooks/useTranslation";
import useEmblaCarousel from "embla-carousel-react";

const Linkify = ({ text }: { text: string }) => {
  const urlRegex = /(https?:\/\/[^\s,;!?)]+(?:\.[^\s,;!?)]+)*)/g;
  const parts = text.split(urlRegex);
  return (
    <>
      {parts.map((part, i) =>
        urlRegex.test(part) ? (
          <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-primary underline break-all">
            {part}
          </a>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
};

interface ItineraryStageCardProps {
  hotspot: Hotspot;
  stageNumber: number;
  onBeforeExpand?: () => boolean;
}

const ItineraryStageCard = ({ hotspot, stageNumber, onBeforeExpand }: ItineraryStageCardProps) => {
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

  useEffect(() => {
    if (emblaApi && lightboxOpen) emblaApi.scrollTo(currentPhotoIndex, true);
  }, [emblaApi, lightboxOpen, currentPhotoIndex]);

  const validGalleryPhotos = hotspot.foto_gallery?.filter(Boolean) || [];

  const handleToggle = () => {
    if (!isExpanded) {
      if (onBeforeExpand && !onBeforeExpand()) return;
    }
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <div className={cn("border-b border-border", isTranslating && "opacity-75")}>
        {/* Collapsed header */}
        <button
          onClick={handleToggle}
          className="w-full flex items-center gap-4 py-5 px-2 text-left group"
          aria-expanded={isExpanded}
        >
          {/* Stage number */}
          <div className="flex-shrink-0 w-9 h-9 rounded-full bg-foreground text-background flex items-center justify-center font-sans font-bold text-sm">
            {stageNumber}
          </div>

          {/* Thumbnail */}
          <div className="flex-shrink-0 w-[100px] h-[70px] md:w-[150px] md:h-[100px] rounded-xl overflow-hidden bg-muted">
            {hotspot.foto_principale ? (
              <img
                src={hotspot.foto_principale}
                alt={translated.titolo}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-muted-foreground text-xs">{t("photo")}</span>
              </div>
            )}
          </div>

          {/* Title + subtitle */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-0.5">
              Tappa {stageNumber}
            </p>
            <h3 className="font-sans text-base md:text-lg font-bold text-foreground truncate">
              {translated.titolo}
            </h3>
            {hotspot.zona && (
              <p className="text-xs text-muted-foreground mt-0.5">📍 {hotspot.zona}</p>
            )}
          </div>

          {/* Chevron */}
          <ChevronDown
            className={cn(
              "w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-200",
              isExpanded && "rotate-180"
            )}
          />
        </button>

        {/* Expanded content */}
        <div
          className={cn(
            "grid transition-all duration-300 ease-out",
            isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          )}
        >
          <div className="overflow-hidden">
            <div className="px-2 pb-6 pl-[calc(0.5rem+2.25rem+1rem)]">
              {/* Brief description */}
              <p className="text-sm text-foreground mb-3">{translated.descrizione_breve}</p>

              {/* Full description */}
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-line mb-4">
                <Linkify text={translated.descrizione_completa} />
              </p>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3">
                {hotspot.link_google_maps && (
                  <a
                    href={hotspot.link_google_maps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-sans font-semibold text-sm transition-all duration-300 hover:scale-105 active:scale-95 shadow-md bg-olive text-olive-foreground"
                  >
                    <Map className="w-5 h-5" />
                    {t("meetPipo")}
                  </a>
                )}
                {hotspot.link_prenotazione && (
                  <a
                    href={hotspot.link_prenotazione}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-sans font-semibold text-sm transition-all duration-300 hover:scale-105 active:scale-95 shadow-md bg-primary text-primary-foreground"
                  >
                    Prenota la tua visita
                  </a>
                )}
              </div>

              {/* Gallery */}
              {validGalleryPhotos.length > 0 && (
                <div className="mt-5 grid grid-cols-3 gap-3">
                  {validGalleryPhotos.map((foto, photoIndex) => (
                    <div
                      key={photoIndex}
                      className="aspect-square rounded-xl overflow-hidden bg-muted cursor-pointer transition-all duration-300 hover:scale-105 shadow-md"
                      onClick={() => {
                        setCurrentPhotoIndex(photoIndex);
                        setLightboxOpen(true);
                      }}
                    >
                      <img
                        src={foto}
                        alt={`${translated.titolo} - ${t("photo")} ${photoIndex + 1}`}
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
      </div>

      {/* Lightbox */}
      {lightboxOpen && validGalleryPhotos.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center animate-fade-in"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            onClick={() => setLightboxOpen(false)}
            aria-label={t("close")}
          >
            <X className="w-6 h-6" />
          </button>

          <div className="w-full h-full flex items-center justify-center px-4" onClick={(e) => e.stopPropagation()}>
            <div className="overflow-hidden w-full max-w-4xl" ref={emblaRef}>
              <div className="flex">
                {validGalleryPhotos.map((foto, index) => (
                  <div key={index} className="flex-[0_0_100%] min-w-0 flex items-center justify-center">
                    <img
                      src={foto}
                      alt={`${translated.titolo} - ${t("photo")} ${index + 1}`}
                      className="max-h-[80vh] max-w-full object-contain rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>

            {validGalleryPhotos.length > 1 && (
              <>
                <button
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                  onClick={scrollPrev}
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                  onClick={scrollNext}
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ItineraryStageCard;
