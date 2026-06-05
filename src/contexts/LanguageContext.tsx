import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "it" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.it) => string;
}

// Static translations for UI elements
export const translations = {
  it: {
    // Navigation
    back: "Indietro",
    backLabel: "Torna indietro",
    menu: "Menu",
    viewSite: "Vedi Sito",
    logout: "Esci",
    
    // Categories & Filters
    allCategories: "Tutte le categorie",
    filter: "Filtra per categoria",
    noCategoryAvailable: "Nessuna categoria disponibile",
    
    // Loading & Errors
    loadingError: "Errore nel caricamento.",
    loadingHotspotsError: "Errore nel caricamento degli hotspot.",
    loadingContentError: "Errore nel caricamento del contenuto.",
    noHotspots: "Nessun hotspot disponibile.",
    noHotspotsCategory: "Nessun hotspot in questa categoria.",
    
    // Mission page
    missionTitle: "La missione di Pipo",
    meetPipo: "INCONTRA PIPO",
    
    // Card actions
    showDetails: "Mostra dettagli",
    hideDetails: "Chiudi dettagli",
    close: "Chiudi",
    navigate: "Naviga",
    
    // Gallery
    previousPhoto: "Foto precedente",
    nextPhoto: "Foto successiva",
    goToPhoto: "Vai alla foto",
    photo: "Foto",
    
    // Language selector
    language: "Lingua",
    languageIt: "Italiano",
    languageEn: "English",
    
    // Hero section
    heroHeadline: "",
    heroSubheadline: "",
    
    // Category grid
    exploreCta: "Esplora gli itinerari di Pipo",
    catLuoghiFantasma: "luoghi fantasma e borghi rurali",
    catNatura: "Natura",
    catBorghi: "Borghi",
    catArteECultura: "Arte e Cultura",

    // Email gate

    // Collections
    collections: "Day Trip e Day Walk",
    collection: "Day Trip / Day Walk",
    noCollections: "Nessun day trip o day walk disponibile.",
    noHotspotsCollection: "Nessun hotspot in questo itinerario.",

    // Zone
    zone: "zona",

    // Scroll
    scrollDown: "Inizia da qui",

    // Auth
    login: "Login",
    logoutLabel: "Logout",
    loggedOut: "Sei uscito",



    // Contact CTA
    contactCta: "Non hai trovato il tuo posto?\nScrivimi. Forse non sei pronto… o forse sì!",
    igHandle: "ig: pipo.fuoriradar !",

    // Decision section
    chooseDayTitle: "Scegli come vivere la tua giornata",
    selfTripTitle: "Esplora senza sbagliare\nItinerari già pronti, zero tempo perso",
    selfTripCta: "Vedi gli itinerari pronti",
    experienceTitle: "Non vuoi organizzare nulla?\nTi portiamo noi, in piccoli gruppi",
    experienceCta: "Unisciti alle prossime esperienze",
    browseTitle: "Decidi come esplorare",
    browseSubtitle: "",
    exploreFreelyCta: "Esplora in libertà",
    exploreByCategoryCta: "Esplora per categoria",

    // Contacts
    contactsTitle: "contatti",
    contactsIg: "IG: pipo.fuoriradar",
    contactsEmail: "pipoesplora@gmail.com",

    // Tagline
    tagline: "Pipo è il progetto che racconta la Sicilia fuori dai radar: mappiamo l'entroterra — i luoghi e le storie che lo tengono vivo — e lo apriamo a chi vuole viverlo davvero.",
    taglineClaim: "Tu scegli, Pipo ti porta fuori dai radar.",

    // Magazine nav
    navExploreFreely: "Esplora in libertà",
    navMap: "Mappa",
    navPlaylist: "Playlist",
    navAbout: "About Pipo",
    navContacts: "Contatti",
    mapTitle: "La mappa di Pipo",
    mapSubtitle: "Tutti i luoghi da esplorare, in un solo sguardo.",

    // About Pipo
    aboutChiTitle: "CHI È PIPO",
    aboutChiBody: "Pipo è uno sguardo diverso sulla Sicilia.\nUn piccolo alieno che osserva la Terra da fuori, lontano dal rumore, dalle mode e dai luoghi pensati solo per essere fotografati.\n\nSeleziona pochi posti, li testa sul campo e li racconta senza filtri:\n📍 indicazioni chiare\n⏱️ tempi reali\n🧭 consigli pratici per viverli davvero",
    aboutPerChiTitle: "PER CHI È",
    aboutPerChiBody: "Pipo è per chi evita il turismo di massa, cerca silenzio e autenticità,\ne vuole esplorare i luoghi con rispetto, senza consumarli.\n\nSe preferisci esperienze essenziali ai percorsi preconfezionati, ti troverai a casa qui.",
    aboutAlienoTitle: "PERCHÈ \"ALIENO\"",
    aboutAlienoBody: "\"Alieno\" è un modo di guardare il mondo: da fuori, senza abituarsi al rumore.\nSignifica vedere ciò che spesso passa inosservato e muoversi fuori dai percorsi più battuti.",
    aboutPrincipioTitle: "IL PRINCIPIO",
    aboutPrincipioBody: "I luoghi non sono contenuti da consumare, ma spazi vivi da attraversare con rispetto.\nL'obiettivo non è solo arrivare, ma come ti comporti mentre ci sei.",

    // Experience waitlist modal
    experienceFakeDoorTitle: "Experience Pipo stanno per partire 🔥",
    experienceFakeDoorSubtitle: "Piccoli gruppi, luoghi autentici, zero turismo di massa.\nTu arrivi, noi pensiamo al resto.",
    experienceFakeDoorDesc: "Stiamo selezionando le prime experience in Sicilia: giornate fuori radar tra natura, borghi, cibo e luoghi fantasma.\n\nVuoi essere tra i primi a saperlo?\nLascia la tua email e ti avvisiamo appena apriamo le prime date.",
    experienceFakeDoorCta: "Avvisami quando aprono le date",
    experienceFakeDoorSuccess: "Perfetto! Ti avviseremo presto.",
    experienceFakeDoorEmail: "La tua email",
  },
  en: {
    // Navigation
    back: "Back",
    backLabel: "Go back",
    menu: "Menu",
    viewSite: "View Site",
    logout: "Logout",
    
    // Categories & Filters
    allCategories: "All categories",
    filter: "Filter by category",
    noCategoryAvailable: "No category available",
    
    // Loading & Errors
    loadingError: "Loading error.",
    loadingHotspotsError: "Error loading hotspots.",
    loadingContentError: "Error loading content.",
    noHotspots: "No hotspots available.",
    noHotspotsCategory: "No hotspots in this category.",
    
    // Mission page
    missionTitle: "Pipo's Mission",
    meetPipo: "MEET PIPO",
    
    // Card actions
    showDetails: "Show details",
    hideDetails: "Hide details",
    close: "Close",
    navigate: "Navigate",
    
    // Gallery
    previousPhoto: "Previous photo",
    nextPhoto: "Next photo",
    goToPhoto: "Go to photo",
    photo: "Photo",
    
    // Language selector
    language: "Language",
    languageIt: "Italiano",
    languageEn: "English",
    
    // Hero section
    heroHeadline: "",
    heroSubheadline: "",
    
    // Category grid
    exploreCta: "Explore Pipo's itineraries",
    catLuoghiFantasma: "ghost places and rural villages",
    catNatura: "Nature",
    catBorghi: "Villages",
    catArteECultura: "Art & Culture",

    // Email gate

    // Collections
    collections: "Day Trip & Day Walk",
    collection: "Day Trip / Day Walk",
    noCollections: "No day trips or day walks available.",
    noHotspotsCollection: "No hotspots in this itinerary.",

    // Zone
    zone: "zone",

    // Scroll
    scrollDown: "Start here",

    // Auth
    login: "Login",
    logoutLabel: "Logout",
    loggedOut: "Logged out",




    // Contact CTA
    contactCta: "Haven't found your spot?\nWrite me. Maybe you're not ready… or maybe you are!",
    igHandle: "ig: pipo.fuoriradar !",

    // Decision section
    chooseDayTitle: "Choose how you want to spend your day",
    selfTripTitle: "Explore without mistakes\nReady itineraries, zero wasted time",
    selfTripCta: "See ready itineraries",
    experienceTitle: "Don't want to plan anything?\nWe'll take you, in small groups",
    experienceCta: "Join the next experiences",
    browseTitle: "Choose how to explore",
    browseSubtitle: "",
    exploreFreelyCta: "Explore freely",
    exploreByCategoryCta: "Explore by category",

    // Contacts
    contactsTitle: "contacts",
    contactsIg: "IG: pipo.fuoriradar",
    contactsEmail: "pipoesplora@gmail.com",

    // Tagline
    tagline: "Pipo is the project that tells the story of Sicily off the radar: we map the inland — the places and the stories that keep it alive — and open it up to those who want to truly live it.",
    taglineClaim: "You choose, Pipo takes you off the radar.",

    // Magazine nav
    navExploreFreely: "Explore freely",
    navMap: "Map",
    navPlaylist: "Playlist",
    navAbout: "About Pipo",
    navContacts: "Contacts",
    mapTitle: "Pipo's map",
    mapSubtitle: "All the places to explore, at a single glance.",

    // About Pipo
    aboutChiTitle: "WHO IS PIPO",
    aboutChiBody: "Pipo is a different way of looking at Sicily.\nA little alien observing Earth from the outside, away from noise, trends and places designed only to be photographed.\n\nHe picks a few spots, tests them in the field and shares them unfiltered:\n📍 clear directions\n⏱️ real times\n🧭 practical tips to really live them",
    aboutPerChiTitle: "WHO IT'S FOR",
    aboutPerChiBody: "Pipo is for those who avoid mass tourism, who seek silence and authenticity,\nand who want to explore places with respect, without consuming them.\n\nIf you prefer essential experiences over pre-packaged routes, you'll feel at home here.",
    aboutAlienoTitle: "WHY \"ALIEN\"",
    aboutAlienoBody: "\"Alien\" is a way of looking at the world: from the outside, without getting used to the noise.\nIt means seeing what usually goes unnoticed and moving off the beaten path.",
    aboutPrincipioTitle: "THE PRINCIPLE",
    aboutPrincipioBody: "Places aren't content to consume, but living spaces to cross with respect.\nThe goal isn't just to arrive, but how you behave while you're there.",

    // Experience waitlist modal
    experienceFakeDoorTitle: "Pipo Experiences are launching soon 🔥",
    experienceFakeDoorSubtitle: "Small groups, authentic places, zero mass tourism.\nYou show up, we handle the rest.",
    experienceFakeDoorDesc: "We're selecting the first experiences in Sicily: off-radar days through nature, villages, food and ghost places.\n\nWant to be among the first to know?\nLeave your email and we'll notify you as soon as we open the first dates.",
    experienceFakeDoorCta: "Notify me when dates open",
    experienceFakeDoorSuccess: "Great! We'll notify you soon.",
    experienceFakeDoorEmail: "Your email",
  },
} as const;

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("pipo-language");
    return (saved as Language) || "it";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("pipo-language", lang);
  };

  const t = (key: keyof typeof translations.it): string => {
    return translations[language][key] || translations.it[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
