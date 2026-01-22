import pipoAlien from "@/assets/pipo-alien-new.png";

interface HeroSectionProps {
  onCtaClick: () => void;
}

const HeroSection = ({ onCtaClick }: HeroSectionProps) => {
  return (
    <section className="bg-background px-6 py-12 flex flex-col items-center text-center min-h-[75vh] justify-center">
      {/* H1 - Headline in Rubik Bubbles */}
      <h1 className="font-bubbles text-[30px] text-foreground leading-tight">
        Esplorazioni aliene in Sicilia
      </h1>

      {/* H2 - Subheadline in Inter 18 semibold */}
      <h2 className="font-sans text-[18px] font-semibold text-foreground mt-6 max-w-sm leading-relaxed">
        Trova pace fuori dai radar e decidi in 30 secondi dove andare
        <br />
        Posti scelti da un alieno (vero): niente caos, niente folla, nessun imprevisto
      </h2>

      {/* CTA Button - Bottone con bordo nero, sfondo bianco */}
      <div className="w-full max-w-sm mt-10 relative">
        <button
          onClick={onCtaClick}
          className="w-full px-6 py-4 rounded-full font-sans font-bold italic text-[22px] text-foreground bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]"
        >
          Portami via in 30 secondi
        </button>
        
        {/* Pipo che indica il bottone */}
        <img 
          src={pipoAlien} 
          alt="Pipo"
          className="absolute -right-2 -bottom-8 w-12 h-12 object-contain transform rotate-12"
          draggable={false}
        />
        
        {/* Sublabel */}
        <p className="text-[22px] text-muted-foreground mt-6 font-sans">
          Zona → Mood → Esplora in libertà
        </p>
      </div>

      {/* Micro-proof */}
      <p className="text-[15px] text-muted-foreground mt-10 max-w-xs font-sans leading-relaxed">
        Ti mostro posti iper selezionati, lontani dal turismo di massa
        <br />
        Tu scegli, io ti porto fuori dai radar
      </p>
    </section>
  );
};

export default HeroSection;
