/**
 * =====================================================
 * PIPO - DATI HOTSPOT SICILIA
 * =====================================================
 * 
 * Per aggiungere un nuovo hotspot:
 * 1. Copia un oggetto esistente
 * 2. Modifica i campi con i tuoi dati
 * 3. Aggiungi le URL delle immagini
 * 
 * Campi:
 * - id: identificatore unico (usa numeri progressivi)
 * - titolo: nome dell'hotspot
 * - descrizioneBreve: una riga di testo (max ~60 caratteri)
 * - descrizioneCompleta: descrizione estesa
 * - fotoPrincipale: URL dell'immagine principale
 * - fotoGallery: array con 2-3 URL di foto aggiuntive
 * - linkGoogleMaps: link Google Maps per la navigazione
 */

export interface Hotspot {
  id: number;
  titolo: string;
  descrizioneBreve: string;
  descrizioneCompleta: string;
  fotoPrincipale: string;
  fotoGallery: string[];
  linkGoogleMaps: string;
}

export const hotspots: Hotspot[] = [
  {
    id: 1,
    titolo: "Cefalù",
    descrizioneBreve: "Borgo marinaro con la maestosa Rocca e il Duomo normanno",
    descrizioneCompleta: "Cefalù è uno dei borghi più affascinanti della Sicilia, incastonato tra il mare cristallino e l'imponente Rocca. Il suo centro storico medievale, dominato dal magnifico Duomo normanno con i suoi mosaici bizantini, si snoda in un labirinto di vicoli lastricati. La spiaggia sabbiosa nel cuore del paese e il lungomare pittoresco rendono questo borgo una meta imperdibile per chi visita l'isola.",
    fotoPrincipale: "",
    fotoGallery: ["", "", ""],
    linkGoogleMaps: "https://maps.google.com/?q=Cefalù,+Sicilia"
  },
  {
    id: 2,
    titolo: "Taormina",
    descrizioneBreve: "La perla dello Ionio con il Teatro Greco e vista sull'Etna",
    descrizioneCompleta: "Taormina è un gioiello incastonato sulla costa orientale della Sicilia, famosa in tutto il mondo per il suo Teatro Greco-Romano che offre una vista mozzafiato sull'Etna e sul mare. Il Corso Umberto, la via principale, è un susseguirsi di palazzi storici, boutique eleganti e caffè con terrazze panoramiche. Isola Bella, raggiungibile con la funivia, è una riserva naturale di straordinaria bellezza.",
    fotoPrincipale: "",
    fotoGallery: ["", "", ""],
    linkGoogleMaps: "https://maps.google.com/?q=Taormina,+Sicilia"
  },
  {
    id: 3,
    titolo: "Marzamemi",
    descrizioneBreve: "Antico borgo di pescatori con la tonnara e piazzetta sul mare",
    descrizioneCompleta: "Marzamemi è un piccolo borgo di pescatori nel sud-est della Sicilia, nato attorno all'antica tonnara araba. La sua piazza Regina Margherita, affacciata sul mare, è il cuore pulsante del paese con i suoi ristoranti di pesce e le casette dei pescatori. Il borgo conserva intatto il fascino di un tempo, con le reti stese al sole e le barche colorate che dondolano nel porticciolo.",
    fotoPrincipale: "",
    fotoGallery: ["", "", ""],
    linkGoogleMaps: "https://maps.google.com/?q=Marzamemi,+Sicilia"
  },
  {
    id: 4,
    titolo: "Erice",
    descrizioneBreve: "Borgo medievale sospeso tra le nuvole a 750 metri d'altezza",
    descrizioneCompleta: "Erice è un borgo medievale arroccato sulla vetta del Monte San Giuliano, avvolto spesso da una suggestiva nebbia che gli conferisce un'atmosfera quasi mistica. Le sue stradine acciottolate, le chiese normanne e i cortili fioriti raccontano secoli di storia. Dalla vetta si gode una vista spettacolare sulle Isole Egadi e sulle saline di Trapani. Imperdibili le paste di mandorla delle storiche pasticcerie.",
    fotoPrincipale: "",
    fotoGallery: ["", "", ""],
    linkGoogleMaps: "https://maps.google.com/?q=Erice,+Sicilia"
  },
  {
    id: 5,
    titolo: "Scopello",
    descrizioneBreve: "Tonnara storica e faraglioni che emergono dal mare turchese",
    descrizioneCompleta: "Scopello è un minuscolo borgo che custodisce uno degli scorci più fotografati della Sicilia: la tonnara con i suoi faraglioni che si ergono maestosi dal mare cristallino. Il baglio centrale, circondato da case in pietra e bouganville, è il cuore di questo piccolo paradiso. Da qui partono i sentieri per la Riserva dello Zingaro, una delle aree protette più belle del Mediterraneo.",
    fotoPrincipale: "",
    fotoGallery: ["", "", ""],
    linkGoogleMaps: "https://maps.google.com/?q=Scopello,+Sicilia"
  },
  {
    id: 6,
    titolo: "Castelmola",
    descrizioneBreve: "Nido d'aquila sopra Taormina con vista infinita sul mare",
    descrizioneCompleta: "Castelmola è un borgo incantato arroccato sopra Taormina, raggiungibile attraverso una strada panoramica mozzafiato. Dalla piazza del paese, dominata dai resti del castello normanno, lo sguardo spazia dall'Etna alle coste calabre. Il borgo è famoso per il vino alla mandorla servito nei caratteristici bar con terrazze vertiginose. Un luogo sospeso nel tempo dove il silenzio è rotto solo dal canto degli uccelli.",
    fotoPrincipale: "",
    fotoGallery: ["", "", ""],
    linkGoogleMaps: "https://maps.google.com/?q=Castelmola,+Sicilia"
  }
];
