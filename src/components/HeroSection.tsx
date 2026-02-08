import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useHotspots } from "@/hooks/useHotspots";
import { useSiteContent } from "@/hooks/useSiteContent";
import { useTranslatedContent } from "@/hooks/useTranslation";
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
    data: missionContent,
    isLoading: missionLoading
  } = useSiteContent("mission");
  const {
    data: missionPart2Content,
    isLoading: missionPart2Loading
  } = useSiteContent("mission_part2");

  // Translate ALL database content
  const missionText = missionContent?.content || null;
  const missionPart2Text = missionPart2Content?.content || null;
  const headlineText = heroHeadlineContent?.content || null;
  const subtitleText = heroSubtitleContent?.content || null;

  const {
    translatedText: translatedMission,
    isTranslating: isTranslating1
  } = useTranslatedContent(missionText);
  const {
    translatedText: translatedMissionPart2,
    isTranslating: isTranslating2
  } = useTranslatedContent(missionPart2Text);
  const {
    translatedText: translatedHeadline,
    isTranslating: isTranslatingHeadline
  } = useTranslatedContent(headlineText);
  const {
    translatedText: translatedSubtitle,
    isTranslating: isTranslatingSubtitle
  } = useTranslatedContent(subtitleText);

  // Use translated DB content, fallback to t() if no DB content
  const headline = translatedHeadline || t("heroHeadline");
  const subtitle = translatedSubtitle || t("heroSubheadline");

  // Get first 5 hotspot main photos
  const carouselPhotos = hotspots?.slice(0, 5).map(h => h.foto_principale).filter((photo): photo is string => !!photo) ?? [];
  const handlePhotoClick = () => {
    navigate("/esplora");
  };
  return <section className="px-6 py-12 flex flex-col min-h-[75vh] justify-center" style={{
    backgroundColor: bgColor || undefined
  }}>
      <div className="max-w-4xl mx-auto w-full md:flex md:flex-col md:items-center">
        {/* Headline - Responsive: 32px mobile, 48px desktop, centered on desktop */}
        <h1 className="font-sans text-[32px] md:text-[48px] font-bold leading-[1.1] text-foreground text-left md:text-center">
          {headline}
        </h1>

        {/* Subtitle - Inter 16px medium, centered on desktop */}
        <p className="font-sans text-base font-medium text-foreground text-left md:text-center mt-6 max-w-md md:mx-auto">
          {subtitle}
        </p>

        {/* CTA Buttons Container */}
        <div className="w-full max-w-sm mt-8 md:mx-auto">
          {/* PRIMARY CTA - Explore Hotspots */}
          <button onClick={onCtaClick} className="w-full px-8 py-4 font-sans text-base font-medium text-background rounded-full transition-all duration-200 hover:opacity-90 active:scale-[0.98] bg-fuchsia-700 hover:bg-fuchsia-600">
            {t("heroSecondaryCtaBtn")}
          </button>
          <p className="font-sans text-[13px] font-medium text-muted-foreground mt-3 text-center">
            {t("heroSecondaryCtaSublabel")}
          </p>
        </div>

        {/* Photo Carousel */}
        {carouselPhotos.length > 0 && <div className="w-full mt-10">
            <Carousel opts={{
          align: "start",
          loop: true
        }} className="w-full">
              <CarouselContent className="-ml-2">
                {carouselPhotos.map((photo, index) => <CarouselItem key={index} className="pl-2 basis-4/5 md:basis-2/5 lg:basis-1/3">
                    <div onClick={handlePhotoClick} className="cursor-pointer overflow-hidden rounded-2xl aspect-[4/3]">
                      <img src={photo} alt={`Hotspot ${index + 1}`} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
                    </div>
                  </CarouselItem>)}
              </CarouselContent>
            </Carousel>
          </div>}

        {/* Mission Content - Below carousel, no title */}
        {(missionContent || missionPart2Content) && <div className="w-full mt-16 max-w-md md:mx-auto">
            {missionLoading || missionPart2Loading ? <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div> : <>
                {/* Part 1 - Before CTA */}
                {missionContent && <p className={`font-sans text-base font-medium text-foreground leading-relaxed text-center whitespace-pre-wrap ${isTranslating1 ? "opacity-50" : ""}`}>
                    {translatedMission || missionContent.content}
                  </p>}
                
                {/* CTA Button in the middle - uses secondary style here too */}
                <div className="w-full max-w-sm mt-10 mb-10 mx-auto">
                  <button onClick={onCtaClick} className="w-full px-8 py-3 font-sans text-base font-medium bg-transparent text-foreground border-2 border-foreground rounded-full transition-all duration-200 hover:bg-foreground/5 active:scale-[0.98]">
                    {t("heroSecondaryCtaBtn")}
                  </button>
                </div>
                
                {/* Part 2 - After CTA */}
                {missionPart2Content && <p className={`font-sans text-base font-medium text-foreground leading-relaxed text-center whitespace-pre-wrap ${isTranslating2 ? "opacity-50" : ""}`}>
                    {translatedMissionPart2 || missionPart2Content.content}
                  </p>}
              </>}
          </div>}
      </div>
    </section>;
};
export default HeroSection;