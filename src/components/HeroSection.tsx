import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useHotspots } from "@/hooks/useHotspots";
import { useSiteContent } from "@/hooks/useSiteContent";
import { useTranslatedContent } from "@/hooks/useTranslation";
import { useMemo } from "react";

interface HeroSectionProps {
  bgColor?: string;
}

const CATEGORIES = [
  { key: "catLuoghiFantasma" as const, dbValue: "Luoghi Fantasma" },
  { key: "catNatura" as const, dbValue: "Natura" },
  { key: "catBorghi" as const, dbValue: "Borghi" },
  { key: "catArteECultura" as const, dbValue: "Arte e Cultura" },
];

const HeroSection = ({ bgColor }: HeroSectionProps) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { data: hotspots } = useHotspots();

  const { data: heroHeadlineContent } = useSiteContent("hero_headline");
  const { data: heroSubtitleContent } = useSiteContent("hero_subtitle");

  const headlineText = heroHeadlineContent?.content || null;
  const subtitleText = heroSubtitleContent?.content || null;

  const { translatedText: translatedHeadline } = useTranslatedContent(headlineText);
  const { translatedText: translatedSubtitle } = useTranslatedContent(subtitleText);

  const headline = translatedHeadline || t("heroHeadline");
  const subtitle = translatedSubtitle || t("heroSubheadline");

  const categoryImages = useMemo(() => {
    if (!hotspots) return {};
    const map: Record<string, string> = {};
    for (const cat of CATEGORIES) {
      const match = hotspots.find(h => h.categoria === cat.dbValue && h.foto_principale);
      if (match?.foto_principale) {
        map[cat.dbValue] = match.foto_principale;
      }
    }
    return map;
  }, [hotspots]);

  // Get a random hotspot image for Collezioni card
  const collezioniImage = useMemo(() => {
    if (!hotspots) return null;
    const withPhoto = hotspots.filter(h => h.foto_principale);
    return withPhoto.length > 0 ? withPhoto[0].foto_principale : null;
  }, [hotspots]);

  const handleCategoryClick = (category: string) => {
    navigate(`/esplora?categoria=${encodeURIComponent(category)}`);
  };

  return (
    <section
      className="px-6 py-12 flex flex-col min-h-[75vh] justify-center"
      style={{ backgroundColor: bgColor || undefined }}
    >
      <div className="max-w-4xl mx-auto w-full md:flex md:flex-col md:items-center">
        {/* Headline */}
        <h1 className="font-sans text-[32px] md:text-[48px] font-bold leading-[1.1] text-foreground text-left md:text-center">
          {headline}
        </h1>

        {/* Subtitle */}
        <p className="font-sans text-base font-medium text-foreground text-left md:text-center mt-6 max-w-md md:mx-auto">
          {subtitle}
        </p>

        {/* CTA Text */}
        <p className="font-sans text-lg font-bold italic text-foreground text-center mt-10">
          {t("exploreCta")}
        </p>

        {/* 2x2 Category Grid */}
        <div className="grid grid-cols-2 gap-3 mt-6 w-full max-w-lg md:mx-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.dbValue}
              onClick={() => handleCategoryClick(cat.dbValue)}
              className="relative aspect-square rounded-2xl overflow-hidden group focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {categoryImages[cat.dbValue] ? (
                <img
                  src={categoryImages[cat.dbValue]}
                  alt={t(cat.key)}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-muted" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <span className="absolute bottom-3 left-3 right-3 text-white font-sans text-sm md:text-base font-bold text-left leading-tight drop-shadow-lg">
                {t(cat.key)}
              </span>
            </button>
          ))}
        </div>

        {/* Collezioni Card - full width */}
        <div className="mt-3 w-full max-w-lg md:mx-auto">
          <button
            onClick={() => navigate("/esplora")}
            className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden group focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {collezioniImage ? (
              <img
                src={collezioniImage}
                alt="Collezioni"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-muted" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <span className="absolute bottom-3 left-3 right-3 text-white font-sans text-lg md:text-xl font-bold text-left leading-tight drop-shadow-lg">
              Collezioni
            </span>
          </button>
        </div>

        {/* Scroll indicator */}
        <div className="flex justify-center mt-10">
          <ChevronDown className="w-6 h-6 text-foreground/40 animate-bounce" />
        </div>

        {/* Static Mission Content */}
        <div className="w-full mt-12 max-w-md md:mx-auto space-y-10 text-left">
          <div>
            <h2 className="font-sans text-xl font-bold text-foreground mb-3">Chi è Pipo</h2>
            <p className="font-sans text-base text-foreground/80 leading-relaxed">
              Pipo è un piccolo alieno che per anni ha considerato la Terra il suo giardino segreto.
              Oggi la ritrova piena di rumore, folle in movimento e luoghi invasi solo per essere fotografati.
            </p>
            <ul className="mt-4 space-y-2 font-sans text-base text-foreground/80 leading-relaxed">
              <li>• Cerca silenzio dove tutti cercano spettacolo</li>
              <li>• Preferisce le crepe alla vernice fresca</li>
              <li>• Si muove "fuori radar", lontano dai percorsi obbligati</li>
            </ul>
          </div>

          <div>
            <h2 className="font-sans text-xl font-bold text-foreground mb-3">Cosa fa Pipo</h2>
            <p className="font-sans text-base text-foreground/80 leading-relaxed">
              Pipo torna sulla Terra per scovare angoli autentici: posti dove si può ancora respirare verità, senza filtri né sovrastrutture.
            </p>
            <ul className="mt-4 space-y-2 font-sans text-base text-foreground/80 leading-relaxed">
              <li>• Individua luoghi e percorsi lontani dalle folle</li>
              <li>• Li traduce in esperienze pensate per pochi, non per tutti</li>
              <li>• Ti guida passo passo, se dimostri di meritarlo</li>
            </ul>
          </div>

          <div>
            <h2 className="font-sans text-xl font-bold text-foreground mb-3">Per chi è Pipo</h2>
            <p className="font-sans text-base text-foreground/80 leading-relaxed">
              Pipo è per Esploratori, viaggiatori, local, per chi preferisce luoghi veri a posti da cartolina e accetta di esplorare con rispetto.
            </p>
            <p className="font-sans text-base text-foreground/80 leading-relaxed mt-4 font-semibold">
              Pipo è per te se:
            </p>
            <ul className="mt-2 space-y-2 font-sans text-base text-foreground/80 leading-relaxed">
              <li>• ti piace evitare il turismo di massa e le file infinite</li>
              <li>• cerchi silenzio, angoli nascosti e paesaggi "fuori radar"</li>
              <li>• sei disposto a rispettare i luoghi, non a usarli come sfondo per foto</li>
              <li>• vuoi percorsi essenziali, senza tour organizzati e programmi preconfezionati</li>
            </ul>
          </div>

          <div>
            <h2 className="font-sans text-xl font-bold text-foreground mb-3">Cosa si intende per "alieno"</h2>
            <p className="font-sans text-base text-foreground/80 leading-relaxed">
              Quando diciamo che Pipo è un alieno, non parliamo solo di un personaggio.
              "Alieno" è un modo di guardare il mondo: da fuori, con occhi che non si sono ancora abituati al rumore.
            </p>
            <ul className="mt-4 space-y-2 font-sans text-base text-foreground/80 leading-relaxed">
              <li>• Vede quello che gli altri non notano più</li>
              <li>• Non si lascia ipnotizzare dalle mode o dalle foto perfette</li>
              <li>• Sospetta di tutto ciò che esiste solo per essere mostrato, non vissuto</li>
            </ul>
          </div>

          <div>
            <h2 className="font-sans text-xl font-bold text-foreground mb-3">Rispetto e generazione di valore per le aree interne</h2>
            <p className="font-sans text-base text-foreground/80 leading-relaxed">
              Pipo rispetta la Terra in modo viscerale: tocca senza deturpare, consuma cercando di rigenerare.
              Si aspetta che chi lo segue faccia lo stesso.
            </p>
            <ul className="mt-4 space-y-2 font-sans text-base text-foreground/80 leading-relaxed">
              <li>• Nessun luogo è "contenuto": è uno spazio vivo da proteggere</li>
              <li>• Ogni passaggio deve lasciare meno traccia possibile</li>
              <li>• Il vero valore non è "andare", ma come ci si comporta mentre si è lì</li>
            </ul>
            <p className="font-sans text-base text-foreground/80 leading-relaxed mt-6 italic">
              Se cerchi solo un posto dove fingere di essere vivo, Pipo non fa per te.
              Se invece vuoi imparare a muoverti con rispetto, ti mostrerà i suoi rifugi segreti.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
