import { useTranslatedContent } from "@/hooks/useTranslation";

interface MissionSectionProps {
  missionContent?: string;
  missionPart2Content?: string;
}

const FALLBACK_MISSION_PART1 = [
  { title: "Chi è Pipo", text: "Pipo è un piccolo alieno che per anni ha considerato la Terra il suo giardino segreto. Oggi la ritrova piena di rumore, folle in movimento e luoghi invasi solo per essere fotografati.", bullets: ["Cerca silenzio dove tutti cercano spettacolo", "Preferisce le crepe alla vernice fresca", "Si muove \"fuori radar\", lontano dai percorsi obbligati"] },
  { title: "Cosa fa Pipo", text: "Pipo torna sulla Terra per scovare angoli autentici: posti dove si può ancora respirare verità, senza filtri né sovrastrutture.", bullets: ["Individua luoghi e percorsi lontani dalle folle", "Li traduce in esperienze pensate per pochi, non per tutti", "Ti guida passo passo, se dimostri di meritarlo"] },
  { title: "Per chi è Pipo", text: "Pipo è per Esploratori, viaggiatori, local, per chi preferisce luoghi veri a posti da cartolina e accetta di esplorare con rispetto.", extra: "Pipo è per te se:", bullets: ["ti piace evitare il turismo di massa e le file infinite", "cerchi silenzio, angoli nascosti e paesaggi \"fuori radar\"", "sei disposto a rispettare i luoghi, non a usarli come sfondo per foto", "vuoi percorsi essenziali, senza tour organizzati e programmi preconfezionati"] },
];

const FALLBACK_MISSION_PART2 = [
  { title: "Cosa si intende per \"alieno\"", text: "Quando diciamo che Pipo è un alieno, non parliamo solo di un personaggio. \"Alieno\" è un modo di guardare il mondo: da fuori, con occhi che non si sono ancora abituati al rumore.", bullets: ["Vede quello che gli altri non notano più", "Non si lascia ipnotizzare dalle mode o dalle foto perfette", "Sospetta di tutto ciò che esiste solo per essere mostrato, non vissuto"] },
  { title: "Rispetto e generazione di valore per le aree interne", text: "Pipo rispetta la Terra in modo viscerale: tocca senza deturpare, consuma cercando di rigenerare. Si aspetta che chi lo segue faccia lo stesso.", bullets: ["Nessun luogo è \"contenuto\": è uno spazio vivo da proteggere", "Ogni passaggio deve lasciare meno traccia possibile", "Il vero valore non è \"andare\", ma come ci si comporta mentre si è lì"], closing: "Se cerchi solo un posto dove fingere di essere vivo, Pipo non fa per te. Se invece vuoi imparare a muoverti con rispetto, ti mostrerà i suoi rifugi segreti." },
];

const MissionSection = ({ missionContent, missionPart2Content }: MissionSectionProps) => {
  const { translatedText: translatedMission } = useTranslatedContent(missionContent || null);
  const { translatedText: translatedMission2 } = useTranslatedContent(missionPart2Content || null);

  const hasMissionFromDB = !!translatedMission;
  const hasMission2FromDB = !!translatedMission2;

  return (
    <div className="w-full mt-12 max-w-md md:mx-auto space-y-10 text-left">
      {hasMissionFromDB ? (
        <div className="font-sans text-base text-foreground/80 leading-relaxed whitespace-pre-line">
          {translatedMission}
        </div>
      ) : (
        FALLBACK_MISSION_PART1.map((section, i) => (
          <div key={i}>
            <h2 className="font-sans text-xl font-bold text-foreground mb-3">{section.title}</h2>
            <p className="font-sans text-base text-foreground/80 leading-relaxed">{section.text}</p>
            {section.extra && (
              <p className="font-sans text-base text-foreground/80 leading-relaxed mt-4 font-semibold">{section.extra}</p>
            )}
            <ul className="mt-4 space-y-2 font-sans text-base text-foreground/80 leading-relaxed">
              {section.bullets.map((b, j) => <li key={j}>• {b}</li>)}
            </ul>
          </div>
        ))
      )}

      {hasMission2FromDB ? (
        <div className="font-sans text-base text-foreground/80 leading-relaxed whitespace-pre-line">
          {translatedMission2}
        </div>
      ) : (
        FALLBACK_MISSION_PART2.map((section, i) => (
          <div key={i}>
            <h2 className="font-sans text-xl font-bold text-foreground mb-3">{section.title}</h2>
            <p className="font-sans text-base text-foreground/80 leading-relaxed">{section.text}</p>
            <ul className="mt-4 space-y-2 font-sans text-base text-foreground/80 leading-relaxed">
              {section.bullets.map((b, j) => <li key={j}>• {b}</li>)}
            </ul>
            {section.closing && (
              <p className="font-sans text-base text-foreground/80 leading-relaxed mt-6 italic">{section.closing}</p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default MissionSection;
