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
    
    // Claim labels
    claimTiAiuta: "TI AIUTA A:",
    claimQuando: "QUANDO:",
    claimRisolve: "RISOLVE:",
    claimCome: "COME:",
    
    // Wizard
    wizardTitle: "Portami via da qui",
    wizardZona: "Zona",
    wizardMood: "Mood",
    wizardExplore: "Esplora in Libertà",
    wizardYourTurn: "Ancora qui?",
    
    // Explore page
    foundResults: "Trovati",
    results: "risultati",
    
    // Hero section
    heroHeadline: "Esplorazioni aliene in Sicilia",
    heroSubheadline: "Ti mostro posti iper selezionati, lontani dal turismo di massa. Tu scegli, io ti porto fuori dai radar in 30 secondi.",
    heroSecondaryCtaBtn: "esplora gli hotspot di pipo",
    heroSecondaryCtaSublabel: "Scopri gli hotspot alieni in base al tuo mood e alla zona che vuoi esplorare.",
    
    // Wizard Instagram CTA
    wizardInstagramBtn: "Sblocca 1 mappa aliena",
    wizardInstagramDesc: "Scrivimi ALIENO in DM su Instagram e ti mando 1 dei 3 itinerari segreti per esplorare la Sicilia fuori dai radar.",
    
    // Alien Map CTA (end of funnel)
    alienMapCtaTitle: "Vuoi una mappa ancora più aliena?",
    alienMapCtaDesc: "Se dopo aver esplorato gli hotspot di Pipo vuoi un itinerario pensato solo per te, puoi sbloccare 1 mappa aliena segreta, scrivimi ALIENO in DM su Instagram",
    instagramCtaBtn: "Scrivimi su Instagram",
    
    // Category grid
    exploreCta: "Esplora gli itinerari di Pipo",
    catLuoghiFantasma: "Luoghi Fantasma",
    catNatura: "Natura",
    catBorghi: "Borghi",
    catArteECultura: "Arte e Cultura",
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
    
    // Claim labels
    claimTiAiuta: "IT HELPS YOU:",
    claimQuando: "WHEN:",
    claimRisolve: "IT SOLVES:",
    claimCome: "HOW:",
    
    // Wizard
    wizardTitle: "Take me away",
    wizardZona: "Zone",
    wizardMood: "Mood",
    wizardExplore: "Free Exploration",
    wizardYourTurn: "Still here?",
    
    // Explore page
    foundResults: "Found",
    results: "results",
    
    // Hero section
    heroHeadline: "Alien Explorations in Sicily",
    heroSubheadline: "I show you ultra-selected places, far from mass tourism. You choose, I take you off the radar in 30 seconds.",
    heroSecondaryCtaBtn: "explore pipo's hotspots",
    heroSecondaryCtaSublabel: "Discover alien hotspots based on your mood and the area you want to explore.",
    
    // Wizard Instagram CTA
    wizardInstagramBtn: "Unlock 1 alien map",
    wizardInstagramDesc: "DM me ALIENO on Instagram and I'll send you 1 of 3 secret itineraries to explore Sicily off the radar.",
    
    // Alien Map CTA (end of funnel)
    alienMapCtaTitle: "Want an even more alien map?",
    alienMapCtaDesc: "If after exploring Pipo's hotspots you want an itinerary designed just for you, you can unlock 1 secret alien map, DM me ALIENO on Instagram",
    instagramCtaBtn: "DM me on Instagram",
    
    // Category grid
    exploreCta: "Explore Pipo's itineraries",
    catLuoghiFantasma: "Ghost Places",
    catNatura: "Nature",
    catBorghi: "Villages",
    catArteECultura: "Art & Culture",
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
