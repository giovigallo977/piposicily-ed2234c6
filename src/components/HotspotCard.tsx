import { useState, useCallback, useEffect } from "react";
import { Plus, Minus, Navigation, X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Hotspot } from "@/hooks/useHotspots";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslatedHotspot } from "@/hooks/useTranslation";
import { useCardStyle } from "@/hooks/useCardStyle";
import { fontSizeToClass, fontSizeToPx } from "@/types/styles";
import useEmblaCarousel from "embla-carousel-react";

// Font personalizzato per ogni categoria
const getCategoryFont = (category: string): string => {
  const categoryLower = category.toLowerCase();
  if (categoryLower.includes('borgo fantasma')) return '"Rubik Lines", cursive';
  if (categoryLower.includes('natura')) return '"Suez One", serif';
  if (categoryLower.includes('arte') || categoryLower.includes('cultura')) return '"Young Serif", serif';
  if (categoryLower.includes('castello')) return '"Cardo", serif';
  if (categoryLower.includes('archeologia')) return '"Cinzel", serif';
  if (categoryLower.includes('borgo')) return '"Eczar", serif';
  return 'Inter, sans-serif';
};

interface HotspotCardProps {
  hotspot: Hotspot;
  index?: number;
}

const HotspotCard = ({ hotspot, index = 0 }: HotspotCardProps) => {
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

  // Get merged styles (global + hotspot overrides)
  const cardStyle = useCardStyle({
    style_card_bg_color: hotspot.style_card_bg_color,
    style_badge_bg_color: hotspot.style_badge_bg_color,
    style_badge_text_color: hotspot.style_badge_text_color,
    style_expand_btn_color: hotspot.style_expand_btn_color,
    style_cta_btn_color: hotspot.style_cta_btn_color,
    style_cta_btn_text_color: hotspot.style_cta_btn_text_color,
    style_font_color: hotspot.style_font_color,
    style_title_font: hotspot.style_title_font,
    style_title_font_weight: hotspot.style_title_font_weight,
    style_title_font_size: hotspot.style_title_font_size,
    style_body_font: hotspot.style_body_font,
    style_body_font_weight: hotspot.style_body_font_weight,
    style_body_font_size: hotspot.style_body_font_size,
    style_button_font: hotspot.style_button_font,
    style_button_font_weight: hotspot.style_button_font_weight,
    style_button_font_size: hotspot.style_button_font_size,
    style_tag_font: hotspot.style_tag_font,
    style_tag_font_weight: hotspot.style_tag_font_weight,
    style_tag_font_size: hotspot.style_tag_font_size,
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
      <article 
        className={cn(
          "rounded-3xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
          isTranslating && "opacity-75"
        )}
        style={{ backgroundColor: cardStyle.cardBgColor }}
      >
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
            <h2 
              className="leading-tight flex-1 min-w-0 font-sans text-xl"
              style={{ 
                fontWeight: 700,
                color: cardStyle.fontColor,
              }}
            >
              {translated.titolo}
            </h2>
            
            {/* Bottone espansione - grigio chiaro con icona nera sottile */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 flex-shrink-0"
              style={{ backgroundColor: '#E5E5E5' }}
              aria-expanded={isExpanded}
              aria-label={isExpanded ? t("hideDetails") : t("showDetails")}
            >
              {isExpanded ? (
                <Minus className="w-5 h-5 text-black" strokeWidth={1.5} />
              ) : (
                <Plus className="w-5 h-5 text-black" strokeWidth={1.5} />
              )}
            </button>
          </div>

          {/* Categoria sotto il titolo - nero con testo bianco, font personalizzato per categoria */}
          {translated.categoria && (
            <div className="mt-2.5 mb-2.5">
              <span 
                className="px-3 py-1.5 text-xs font-bold rounded-full bg-black text-white"
                style={{ fontFamily: getCategoryFont(translated.categoria) }}
              >
                {translated.categoria}
              </span>
            </div>
          )}

          {/* Riga Tag - Roboto Mono */}
          {hotspot.tags && hotspot.tags.length > 0 && (
            <p 
              className="mt-2 font-mono text-sm"
              style={{ 
                color: cardStyle.fontColor,
              }}
            >
              {hotspot.tags.map((tag, i) => (
                <span key={i}>• {tag} </span>
              ))}
            </p>
          )}

          {/* Descrizione breve - Inter Regular 400 */}
          <p 
            className="mt-2 leading-relaxed font-sans"
            style={{ 
              fontWeight: 400,
              color: cardStyle.fontColor,
              fontSize: fontSizeToPx(cardStyle.bodyFontSize),
            }}
          >
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
              {/* Descrizione completa - Inter Regular 400 */}
              <p 
                className="leading-relaxed whitespace-pre-line font-sans"
                style={{ 
                  fontWeight: 400,
                  color: cardStyle.fontColor,
                  fontSize: fontSizeToPx(cardStyle.bodyFontSize),
                }}
              >
                {translated.descrizione_completa}
              </p>

              {/* Zona badge - above the CTA button */}
              {hotspot.zona && (
                <div className="mt-4">
                  <span 
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium shadow-sm"
                    style={{ 
                      backgroundColor: cardStyle.badgeBgColor,
                      color: cardStyle.badgeTextColor,
                    }}
                  >
                    📍 zona {hotspot.zona}
                  </span>
                </div>
              )}
              {/* Link Naviga - verde Pipo #52C471 con testo bianco */}
              {hotspot.link_google_maps && (
                <a
                  href={hotspot.link_google_maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-sans font-semibold text-sm text-white transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-md active:scale-95 bg-olive"
                >
                  <span className="text-lg">👽</span>
                  <Navigation className="w-4 h-4" />
                  {t("meetPipo")}
                </a>
              )}

              {/* Galleria foto */}
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
