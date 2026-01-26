import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useHotspots } from "@/hooks/useHotspots";
import { useSiteContent } from "@/hooks/useSiteContent";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
interface HeroSectionProps {
  onCtaClick: () => void;
  bgColor?: string;
}
const HeroSection = ({
  onCtaClick,
  bgColor
}: HeroSectionProps) => {
  const {
    t
  } = useLanguage();
  const navigate = useNavigate();
  const {
    data: hotspots
  } = useHotspots();

  // Fetch editable content from database
  const {
    data: heroHeadlineContent
  } = useSiteContent("hero_headline");
  const {
    data: heroSubtitleContent
  } = useSiteContent("hero_subtitle");
  const {
    data: heroCtaContent
  } = useSiteContent("hero_cta");

  // Use database content or fallback to translations
  const headline = heroHeadlineContent?.content || t("heroHeadline");
  const subtitle = heroSubtitleContent?.content || t("heroSubheadline");
  const ctaText = heroCtaContent?.content || t("heroCtaButton");

  // Get first 5 hotspot main photos
  const carouselPhotos = hotspots?.slice(0, 5).map(h => h.foto_principale).filter((photo): photo is string => !!photo) ?? [];
  const handlePhotoClick = () => {
    navigate("/esplora");
  };
  return <section className="px-6 py-12 flex flex-col min-h-[75vh] justify-center" style={{ backgroundColor: bgColor || undefined }}>
      {/* Headline - Inter 48px bold */}
      <h1 className="font-sans text-[48px] font-bold leading-tight text-foreground text-left">
        {headline}
      </h1>

      {/* Subtitle - Inter 16px medium */}
      <p className="font-sans text-base font-medium text-foreground text-left mt-6 max-w-md">
        {subtitle}
      </p>

      {/* CTA Button - Black with white text, rounded */}
      <div className="w-full max-w-sm mt-8">
        <button onClick={onCtaClick} className="w-full px-8 py-4 font-sans text-base font-medium bg-black text-white rounded-full transition-all duration-200 hover:opacity-90 active:scale-[0.98]">
          {ctaText}
        </button>

        {/* Flow label - 13px gray */}
        <p className="font-sans text-[13px] font-medium text-muted-foreground mt-3 text-center">
          {t("heroSublabel")}
        </p>
      </div>

      {/* Photo Carousel */}
      {carouselPhotos.length > 0 && <div className="w-full mt-10">
          <Carousel opts={{
        align: "start",
        loop: true
      }} className="w-full">
            <CarouselContent className="-ml-2">
              {carouselPhotos.map((photo, index) => <CarouselItem key={index} className="pl-2 basis-4/5 md:basis-3/5">
                  <div onClick={handlePhotoClick} className="cursor-pointer overflow-hidden rounded-2xl aspect-[4/3]">
                    <img src={photo} alt={`Hotspot ${index + 1}`} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
                  </div>
                </CarouselItem>)}
            </CarouselContent>
          </Carousel>
        </div>}
    </section>;
};
export default HeroSection;