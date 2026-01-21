interface HeroSectionProps {
  onCtaClick: () => void;
  onExploreClick: () => void;
}

const HeroSection = ({ onCtaClick, onExploreClick }: HeroSectionProps) => {
  return (
    <section className="bg-background px-6 py-12 flex flex-col items-center text-center min-h-[80vh] justify-center">
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

      {/* CTA Buttons Container */}
      <div className="w-full max-w-sm mt-10 space-y-4">
        {/* Primary CTA - Decidi in 30 secondi */}
        <button
          onClick={onCtaClick}
          className="w-full px-6 py-4 rounded-full font-sans font-bold text-lg text-white bg-olive transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-md"
        >
          Decidi in 30 secondi
        </button>
        
        {/* Sublabel for primary CTA */}
        <p className="text-xs text-muted-foreground">
          Zona → Mood → Scopri i posti perfetti per te
        </p>

        {/* Secondary CTA - Esplora in libertà */}
        <button
          onClick={onExploreClick}
          className="w-full px-6 py-4 rounded-full font-sans font-semibold text-base text-foreground bg-gray-100 border border-gray-200 transition-all duration-300 hover:bg-gray-200 hover:scale-105"
        >
          Esplora in libertà
        </button>
        
        {/* Sublabel for secondary CTA */}
        <p className="text-xs text-muted-foreground">
          Sfoglia tutti i posti senza filtri
        </p>
      </div>

      {/* Micro-proof */}
      <p className="text-sm text-muted-foreground mt-10 max-w-xs italic leading-relaxed">
        "Ti mostro 1-3 posti iper selezionati, lontani da turismo di massa. Tu scegli, io ti porto fuori dai radar."
      </p>
    </section>
  );
};

export default HeroSection;
