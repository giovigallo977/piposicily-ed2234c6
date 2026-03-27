import { useState, useCallback, useEffect } from "react";
import { Plus, Minus, Map, X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/trackEvent";
import type { Hotspot } from "@/hooks/useHotspots";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslatedHotspot } from "@/hooks/useTranslation";
import useEmblaCarousel from "embla-carousel-react";

/** Converts URLs in text into clickable links */
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

interface HotspotCardProps {
  hotspot: Hotspot;
  index?: number;
  onBeforeExpand?: () => boolean;
}

const HotspotCard = ({ hotspot, index = 0, onBeforeExpand }: HotspotCardProps) => {
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

  const handleToggleExpand = () => {
    if (!isExpanded) {
      if (onBeforeExpand && !onBeforeExpand()) return;
      trackEvent("hotspot_view");
      gtag('event', 'hotspot_click', { label: hotspot.categoria || hotspot.titolo });
    }
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <div className="relative">
        <article
          className={cn(
            "rounded-3xl overflow-hidden shadow-lg transition-all duration-300 bg-white hover:shadow-xl hover:-translate-y-1",
            isTranslating && "opacity-75"
          )}
        >
          {/* Main image */}
          <div className="aspect-[4/3] bg-muted overflow-hidden relative">
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

          {/* Content */}
          <div className="p-5">
            <div className="flex items-start justify-between gap-4">
              <h2 className="leading-tight flex-1 min-w-0 font-sans text-xl font-bold text-foreground">
                {translated.titolo}
              </h2>
              <button
                onClick={handleToggleExpand}
                className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 flex-shrink-0 bg-muted"
                aria-expanded={isExpanded}
                aria-label={isExpanded ? t("hideDetails") : t("showDetails")}
              >
                {isExpanded ? (
                  <Minus className="w-5 h-5 text-foreground" strokeWidth={1.5} />
                ) : (
                  <Plus className="w-5 h-5 text-foreground" strokeWidth={1.5} />
                )}
              </button>
            </div>

            {(translated.categoria || hotspot.zona) && (
              <div className="mt-4 mb-4 flex flex-wrap items-center gap-2">
                {translated.categoria && (
                  <span className="px-3 py-1.5 text-xs font-bold rounded-full bg-foreground text-background">
                    {translated.categoria}
                  </span>
                )}
                {hotspot.zona && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-foreground text-background">
                    📍 {t("zone")} {hotspot.zona}
                  </span>
                )}
              </div>
            )}

            {hotspot.tags && hotspot.tags.length > 0 && (
              <p className="mt-2 font-mono text-sm text-foreground">
                {hotspot.tags.map((tag, i) => (
                  <span key={i}>• {tag} </span>
                ))}
              </p>
            )}

            <p className="mt-2 leading-relaxed font-sans text-sm text-foreground">
              {translated.descrizione_breve}
            </p>

            <div
              className={cn(
                "grid transition-all duration-300 ease-out",
                isExpanded ? "grid-rows-[1fr] opacity-100 mt-5" : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="overflow-hidden">
                <p className="leading-relaxed whitespace-pre-line font-sans text-sm text-foreground">
                  <Linkify text={translated.descrizione_completa} />
                </p>

                {hotspot.link_google_maps && (
                  <a
                    href={hotspot.link_google_maps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-sans font-semibold text-sm text-white transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-md active:scale-95 bg-orange-500"
                  >
                    <Map className="w-5 h-5" />
                    {t("meetPipo")}
                  </a>
                )}

                {validGalleryPhotos.length > 0 && (
                  <div className="mt-5 grid grid-cols-3 gap-3">
                    {validGalleryPhotos.map((foto, photoIndex) => (
                      <div
                        key={photoIndex}
                        className="aspect-square rounded-2xl overflow-hidden bg-muted cursor-pointer transition-all duration-300 hover:scale-110 hover:rotate-2 shadow-lg hover:shadow-xl"
                        onClick={() => openLightbox(photoIndex)}
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
        </article>
      </div>

      {/* Lightbox */}
      {lightboxOpen && validGalleryPhotos.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center animate-fade-in"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            onClick={closeLightbox}
            aria-label={t("close")}
          >
            <X className="w-6 h-6" />
          </button>

          <div
            className="w-full h-full flex items-center justify-center px-4"
            onClick={(e) => e.stopPropagation()}
          >
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
