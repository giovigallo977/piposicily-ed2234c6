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
    catLuoghiFantasma: "Luoghi Fantasma",
    catNatura: "Natura",
    catBorghi: "Borghi",
    catArteECultura: "Arte e Cultura",

    // Email gate
    gateTitle: "Ti stai muovendo bene.",
    gateDesc: "Hai già scoperto alcuni luoghi fuori radar.\nVuoi continuare a esplorare con Pipo?",
    gateEmailPlaceholder: "La tua email",
    gateCta: "Continua con Pipo",
    gateSentTitle: "Controlla la tua email!",
    gateSentDesc: "Ti abbiamo inviato un link magico. Cliccaci sopra per continuare a esplorare.",
    gateLocationTitle: "Da dove stai esplorando?",
    gateLocationOther: "Altro",
    gateSkip: "Salta",
    inlineBlockTitle: "Vuoi continuare a esplorare?",

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

    // Free spots
    noFreeSpots: "Nessun free spot ancora.",

    // Contact CTA
    contactCta: "Non hai trovato il tuo posto?\nScrivimi. Forse non sei pronto… o forse sì!",
    igHandle: "ig: pipo.fuoriradar !",

    // Decision section
    chooseDayTitle: "Scegli come vivere la tua giornata",
    selfTripTitle: "Esplora senza sbagliare\nItinerari già pronti, zero tempo perso",
    selfTripCta: "Vedi gli itinerari pronti",
    experienceTitle: "Non vuoi organizzare nulla?\nTi portiamo noi, in piccoli gruppi",
    experienceCta: "Unisciti alle prossime esperienze",
    browseTitle: "Vuoi solo curiosare?",
    browseSubtitle: "Esplora gli spot gratuiti di Pipo per farti un'idea dei luoghi.",

    // Experience waitlist modal
    experienceFakeDoorTitle: "Experience Pipo stanno per partire 🔥",
    experienceFakeDoorDesc: "Piccoli gruppi, luoghi autentici, zero turismo di massa.\nTi portiamo nei posti giusti senza che tu debba organizzare nulla.\n\nStiamo selezionando le prime experience in Sicilia.\nSe vuoi partecipare, lasciaci la tua email: ti avvisiamo appena apriamo le date.",
    experienceFakeDoorCta: "Avvisami quando apre",
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
    catLuoghiFantasma: "Ghost Places",
    catNatura: "Nature",
    catBorghi: "Villages",
    catArteECultura: "Art & Culture",

    // Email gate
    gateTitle: "You're doing great.",
    gateDesc: "You've already discovered some off-radar places.\nWant to keep exploring with Pipo?",
    gateEmailPlaceholder: "Your email",
    gateCta: "Continue with Pipo",
    gateSentTitle: "Check your email!",
    gateSentDesc: "We sent you a magic link. Click it to keep exploring.",
    gateLocationTitle: "Where are you exploring from?",
    gateLocationOther: "Other",
    gateSkip: "Skip",
    inlineBlockTitle: "Want to keep exploring?",

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

    // Free spots
    noFreeSpots: "No free spots yet.",

    // Contact CTA
    contactCta: "Haven't found your spot?\nWrite me. Maybe you're not ready… or maybe you are!",
    igHandle: "ig: pipo.fuoriradar !",

    // Decision section
    chooseDayTitle: "Choose how you want to spend your day",
    selfTripTitle: "Explore without mistakes\nReady itineraries, zero wasted time",
    selfTripCta: "See ready itineraries",
    experienceTitle: "Don't want to plan anything?\nWe'll take you, in small groups",
    experienceCta: "Join the next experiences",
    browseTitle: "Just want to browse?",
    browseSubtitle: "Explore Pipo's free spots to get a feel for the places.",

    // Experience waitlist modal
    experienceFakeDoorTitle: "Pipo Experiences are launching soon 🔥",
    experienceFakeDoorDesc: "Small groups, authentic places, zero mass tourism.\nWe take you to the right spots without you having to organize a thing.\n\nWe're selecting the first experiences in Sicily.\nLeave your email and we'll let you know when dates open.",
    experienceFakeDoorCta: "Notify me when it opens",
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
