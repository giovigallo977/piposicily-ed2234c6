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
              <h2 className="leading-tight flex-1 min-w-0 font-sans uppercase tracking-widest text-sm text-foreground">
                {translated.titolo}
              </h2>
              <button
                onClick={handleToggleExpand}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-foreground/5 flex-shrink-0"
                aria-expanded={isExpanded}
                aria-label={isExpanded ? t("hideDetails") : t("showDetails")}
              >
                {isExpanded ? (
                  <Minus className="w-4 h-4 text-foreground/60" strokeWidth={1.25} />
                ) : (
                  <Plus className="w-4 h-4 text-foreground/60" strokeWidth={1.25} />
                )}
              </button>
            </div>

            {(translated.categoria || hotspot.zona) && (
              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-sans uppercase tracking-widest text-[10px] text-foreground/50">
                {translated.categoria && <span>{translated.categoria}</span>}
                {translated.categoria && hotspot.zona && <span>·</span>}
                {hotspot.zona && <span>{t("zone")} {hotspot.zona}</span>}
              </div>
            )}

            {hotspot.tags && hotspot.tags.length > 0 && (
              <p className="mt-2 font-sans text-xs text-foreground/50">
                {hotspot.tags.join(" · ")}
              </p>
            )}

            <p className="mt-3 leading-relaxed font-sans text-sm text-foreground/80">
              {translated.descrizione_breve}
            </p>

            <div
              className={cn(
                "grid transition-all duration-300 ease-out",
                isExpanded ? "grid-rows-[1fr] opacity-100 mt-5" : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="overflow-hidden">
                <p className="leading-relaxed whitespace-pre-line font-sans text-sm text-foreground/80">
                  <Linkify text={translated.descrizione_completa} />
                </p>

                {hotspot.link_google_maps && (
                  <a
                    href={hotspot.link_google_maps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-2 font-sans uppercase tracking-widest text-xs text-foreground border-b border-foreground/30 hover:border-foreground pb-1 transition-colors"
                  >
                    <Map className="w-4 h-4" strokeWidth={1.25} />
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
