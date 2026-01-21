interface HeroSectionProps {
  onCtaClick: () => void;
}

const HeroSection = ({ onCtaClick }: HeroSectionProps) => {
  return (
    <section className="bg-background px-6 py-12 flex flex-col items-center text-center min-h-[70vh] justify-center">
      {/* H1 - Headline */}
      <h1 
        className="font-sans text-2xl md:text-3xl font-semibold text-olive uppercase tracking-wide"
        style={{ fontWeight: 600 }}
      >
        Esplorazioni aliene in Sicilia
      </h1>

      {/* H2 - Subheadline */}
      <h2 className="font-sans text-base md:text-lg text-foreground mt-6 max-w-md leading-relaxed">
        Trova pace fuori dai radar e decidi in 30 secondi dove andare, con posti scelti da un alieno vero: niente caos, niente folla, niente strade assurde.
      </h2>

      {/* CTA Button */}
      <div className="w-full max-w-sm mt-10">
        <button
          onClick={onCtaClick}
          className="w-full px-6 py-4 rounded-full font-sans font-bold text-lg text-white bg-olive transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-md"
        >
          Decidi in 30 secondi
        </button>
        
        {/* Sublabel */}
        <p className="text-xs text-muted-foreground mt-3">
          Zona → Mood → Esplora in libertà
        </p>
      </div>

      {/* Micro-proof */}
      <p className="text-sm text-muted-foreground mt-10 max-w-xs italic leading-relaxed">
        "Ti mostro posti iper selezionati, lontani da turismo di massa. Tu scegli, io ti porto fuori dai radar."
      </p>
    </section>
  );
};

export default HeroSection;
