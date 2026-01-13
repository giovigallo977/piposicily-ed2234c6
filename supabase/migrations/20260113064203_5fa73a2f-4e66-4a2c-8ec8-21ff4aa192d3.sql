-- Tabella hotspots per memorizzare tutti i dati
CREATE TABLE public.hotspots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titolo TEXT NOT NULL,
  descrizione_breve TEXT NOT NULL,
  descrizione_completa TEXT NOT NULL,
  foto_principale TEXT DEFAULT '',
  foto_gallery TEXT[] DEFAULT ARRAY[]::TEXT[],
  link_google_maps TEXT DEFAULT '',
  ordine INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS: tutti possono leggere gli hotspots (sono pubblici)
ALTER TABLE public.hotspots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Hotspots sono pubblici per la lettura"
ON public.hotspots
FOR SELECT
USING (true);

-- Solo utenti autenticati possono modificare
CREATE POLICY "Utenti autenticati possono inserire hotspots"
ON public.hotspots
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Utenti autenticati possono aggiornare hotspots"
ON public.hotspots
FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Utenti autenticati possono eliminare hotspots"
ON public.hotspots
FOR DELETE
TO authenticated
USING (true);

-- Trigger per aggiornare updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_hotspots_updated_at
BEFORE UPDATE ON public.hotspots
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Inserisco i dati di esempio
INSERT INTO public.hotspots (titolo, descrizione_breve, descrizione_completa, link_google_maps, ordine) VALUES
('Cefalù', 'Borgo marinaro con la maestosa Rocca e il Duomo normanno', 'Cefalù è uno dei borghi più affascinanti della Sicilia, incastonato tra il mare cristallino e l''imponente Rocca. Il suo centro storico medievale, dominato dal magnifico Duomo normanno con i suoi mosaici bizantini, si snoda in un labirinto di vicoli lastricati. La spiaggia sabbiosa nel cuore del paese e il lungomare pittoresco rendono questo borgo una meta imperdibile per chi visita l''isola.', 'https://maps.google.com/?q=Cefalù,+Sicilia', 1),
('Taormina', 'La perla dello Ionio con il Teatro Greco e vista sull''Etna', 'Taormina è un gioiello incastonato sulla costa orientale della Sicilia, famosa in tutto il mondo per il suo Teatro Greco-Romano che offre una vista mozzafiato sull''Etna e sul mare. Il Corso Umberto, la via principale, è un susseguirsi di palazzi storici, boutique eleganti e caffè con terrazze panoramiche. Isola Bella, raggiungibile con la funivia, è una riserva naturale di straordinaria bellezza.', 'https://maps.google.com/?q=Taormina,+Sicilia', 2),
('Marzamemi', 'Antico borgo di pescatori con la tonnara e piazzetta sul mare', 'Marzamemi è un piccolo borgo di pescatori nel sud-est della Sicilia, nato attorno all''antica tonnara araba. La sua piazza Regina Margherita, affacciata sul mare, è il cuore pulsante del paese con i suoi ristoranti di pesce e le casette dei pescatori. Il borgo conserva intatto il fascino di un tempo, con le reti stese al sole e le barche colorate che dondolano nel porticciolo.', 'https://maps.google.com/?q=Marzamemi,+Sicilia', 3),
('Erice', 'Borgo medievale sospeso tra le nuvole a 750 metri d''altezza', 'Erice è un borgo medievale arroccato sulla vetta del Monte San Giuliano, avvolto spesso da una suggestiva nebbia che gli conferisce un''atmosfera quasi mistica. Le sue stradine acciottolate, le chiese normanne e i cortili fioriti raccontano secoli di storia. Dalla vetta si gode una vista spettacolare sulle Isole Egadi e sulle saline di Trapani. Imperdibili le paste di mandorla delle storiche pasticcerie.', 'https://maps.google.com/?q=Erice,+Sicilia', 4),
('Scopello', 'Tonnara storica e faraglioni che emergono dal mare turchese', 'Scopello è un minuscolo borgo che custodisce uno degli scorci più fotografati della Sicilia: la tonnara con i suoi faraglioni che si ergono maestosi dal mare cristallino. Il baglio centrale, circondato da case in pietra e bouganville, è il cuore di questo piccolo paradiso. Da qui partono i sentieri per la Riserva dello Zingaro, una delle aree protette più belle del Mediterraneo.', 'https://maps.google.com/?q=Scopello,+Sicilia', 5),
('Castelmola', 'Nido d''aquila sopra Taormina con vista infinita sul mare', 'Castelmola è un borgo incantato arroccato sopra Taormina, raggiungibile attraverso una strada panoramica mozzafiato. Dalla piazza del paese, dominata dai resti del castello normanno, lo sguardo spazia dall''Etna alle coste calabre. Il borgo è famoso per il vino alla mandorla servito nei caratteristici bar con terrazze vertiginose. Un luogo sospeso nel tempo dove il silenzio è rotto solo dal canto degli uccelli.', 'https://maps.google.com/?q=Castelmola,+Sicilia', 6);