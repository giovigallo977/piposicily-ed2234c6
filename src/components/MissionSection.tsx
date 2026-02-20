import { useTranslatedContent } from "@/hooks/useTranslation";

interface MissionSectionProps {
  missionContent?: string;
}

export const FALLBACK_MISSION_TEXT = `Chi è Pipo
Pipo è un piccolo alieno che per anni ha considerato la Terra il suo giardino segreto. Oggi la ritrova piena di rumore, folle in movimento e luoghi invasi solo per essere fotografati.
• Cerca silenzio dove tutti cercano spettacolo
• Preferisce le crepe alla vernice fresca
• Si muove "fuori radar", lontano dai percorsi obbligati

Cosa fa Pipo
Pipo torna sulla Terra per scovare angoli autentici: posti dove si può ancora respirare verità, senza filtri né sovrastrutture.
• Individua luoghi e percorsi lontani dalle folle
• Li traduce in esperienze pensate per pochi, non per tutti
• Ti guida passo passo, se dimostri di meritarlo

Per chi è Pipo
Pipo è per Esploratori, viaggiatori, local, per chi preferisce luoghi veri a posti da cartolina e accetta di esplorare con rispetto.
Pipo è per te se:
• ti piace evitare il turismo di massa e le file infinite
• cerchi silenzio, angoli nascosti e paesaggi "fuori radar"
• sei disposto a rispettare i luoghi, non a usarli come sfondo per foto
• vuoi percorsi essenziali, senza tour organizzati e programmi preconfezionati

Cosa si intende per "alieno"
Quando diciamo che Pipo è un alieno, non parliamo solo di un personaggio. "Alieno" è un modo di guardare il mondo: da fuori, con occhi che non si sono ancora abituati al rumore.
• Vede quello che gli altri non notano più
• Non si lascia ipnotizzare dalle mode o dalle foto perfette
• Sospetta di tutto ciò che esiste solo per essere mostrato, non vissuto

Rispetto e generazione di valore per le aree interne
Pipo rispetta la Terra in modo viscerale: tocca senza deturpare, consuma cercando di rigenerare. Si aspetta che chi lo segue faccia lo stesso.
• Nessun luogo è "contenuto": è uno spazio vivo da proteggere
• Ogni passaggio deve lasciare meno traccia possibile
• Il vero valore non è "andare", ma come ci si comporta mentre si è lì

Se cerchi solo un posto dove fingere di essere vivo, Pipo non fa per te. Se invece vuoi imparare a muoverti con rispetto, ti mostrerà i suoi rifugi segreti.`;

const MissionSection = ({ missionContent }: MissionSectionProps) => {
  const { translatedText: translatedMission } = useTranslatedContent(missionContent || null);

  const displayText = translatedMission || FALLBACK_MISSION_TEXT;

  return (
    <div className="w-full mt-12 max-w-md md:mx-auto space-y-10 text-left">
      <div className="font-sans text-base font-medium text-foreground/80 leading-relaxed whitespace-pre-line">
        {displayText}
      </div>
    </div>
  );
};

export default MissionSection;
