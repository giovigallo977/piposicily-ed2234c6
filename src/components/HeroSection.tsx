import { useLanguage } from "@/contexts/LanguageContext";
import pipoSurf from "@/assets/pipo-surf.png";

interface HeroSectionProps {
  onCtaClick: () => void;
}

const HeroSection = ({ onCtaClick }: HeroSectionProps) => {
  const { t } = useLanguage();

  return (
    <section className="bg-background px-6 py-12 flex flex-col items-center text-center min-h-[75vh] justify-center">
      {/* Pipo Surf Image */}
      <img 
        src={pipoSurf} 
        alt="Pipo surf" 
        className="h-40 w-auto object-contain mb-6"
        draggable={false}
      />

      {/* H1 - Headline in Rubik Bubbles */}
      <h1 className="font-bubbles text-[30px] text-foreground leading-tight">{t("heroHeadline")}</h1>

      {/* H2 - Subheadline in Inter 18 semibold */}
      <h2 className="font-sans text-[18px] font-semibold text-foreground mt-6 max-w-sm leading-relaxed">
        {t("heroSubheadline")}
        <br />
        {t("heroSubheadline2")}
      </h2>

      {/* CTA Button - Bottone con bordo nero, sfondo bianco */}
      <div className="w-full max-w-sm mt-10 relative">
        <button
          onClick={onCtaClick}
          className="w-full px-6 py-4 rounded-full font-sans font-bold italic text-[22px] text-foreground bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]"
        >
          {t("heroCtaButton")}
        </button>

        {/* Sublabel - same size as micro-proof (15px) */}
        <p className="text-[15px] text-muted-foreground mt-6 font-sans">{t("heroSublabel")}</p>
      </div>

      {/* Micro-proof */}
      <p className="text-[15px] text-muted-foreground mt-10 max-w-xs font-sans leading-relaxed">
        {t("heroMicroProof")}
        <br />
        {t("heroMicroProof2")}
      </p>
    </section>
  );
};

export default HeroSection;
