import { useLanguage } from "@/contexts/LanguageContext";
interface HeroSectionProps {
  onCtaClick: () => void;
}
const HeroSection = ({
  onCtaClick
}: HeroSectionProps) => {
  const {
    t
  } = useLanguage();
  return <section className="bg-background px-6 py-12 flex flex-col items-center text-center min-h-[75vh] justify-center">
      {/* H1 - Headline in Rubik Bubbles */}
      <h1 className="font-bubbles leading-tight text-[#a931c4] text-2xl">{t("heroHeadline")}</h1>

      {/* H2 - Subheadline in Inter 18 semibold */}
      <h2 className="font-sans text-foreground mt-6 max-w-sm leading-relaxed text-lg font-medium">
        {t("heroSubheadline")}
        <br />
        {t("heroSubheadline2")}
      </h2>

      {/* CTA Button - Bottone con bordo nero, sfondo bianco */}
      <div className="w-full max-w-sm mt-10 relative">
        <button onClick={onCtaClick} className="w-full px-6 py-4 font-sans font-bold italic transition-all duration-200 hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] bg-[#a931c4] text-[#60eb2d] border-[#60eb2d] mx-0 border-solid text-lg shadow-lg opacity-100 rounded-md border-2">
          {t("heroCtaButton")}
        </button>

        {/* Sublabel - same size as micro-proof (15px) */}
        <p className="text-muted-foreground font-sans text-base font-thin mt-[10px]">{t("heroSublabel")}</p>
      </div>

      {/* Micro-proof */}
      <p className="text-[15px] text-muted-foreground mt-10 max-w-xs font-sans leading-relaxed text-center">
        {t("heroMicroProof")}
        <br />
        {t("heroMicroProof2")}
      </p>
    </section>;
};
export default HeroSection;