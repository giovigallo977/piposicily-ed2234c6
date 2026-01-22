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
    back: "Indietro",
    menu: "Menu",
    allCategories: "Tutte le categorie",
    noHotspots: "Nessun hotspot disponibile.",
    noHotspotsCategory: "Nessun hotspot in questa categoria.",
    loadingError: "Errore nel caricamento.",
    loadingHotspotsError: "Errore nel caricamento degli hotspot.",
    loadingContentError: "Errore nel caricamento del contenuto.",
    missionTitle: "La missione di Pipo",
    meetPipo: "INCONTRA PIPO",
    showDetails: "Mostra dettagli",
    hideDetails: "Chiudi dettagli",
    close: "Chiudi",
    previousPhoto: "Foto precedente",
    nextPhoto: "Foto successiva",
    goToPhoto: "Vai alla foto",
    photo: "Foto",
    filter: "Filtra per categoria",
    noCategoryAvailable: "Nessuna categoria disponibile",
    language: "Lingua",
    languageIt: "Italiano",
    languageEn: "English",
    // Claim labels
    claimTiAiuta: "TI AIUTA A:",
    claimQuando: "QUANDO:",
    claimRisolve: "RISOLVE:",
    claimCome: "COME:",
    // Wizard
    wizardTitle: "Portami via in 30 secondi",
    wizardZona: "Zona",
    wizardMood: "Mood",
    wizardExplore: "Esplora in Libertà",
    wizardYourTurn: "adesso tocca a te",
    // Explore page
    foundResults: "Trovati",
    results: "risultati",
    // Hero section
    heroHeadline: "Esplorazioni aliene in Sicilia",
    heroSubheadline: "Trova pace fuori dai radar e decidi in 30 secondi dove andare",
    heroSubheadline2: "Posti scelti da un alieno (vero): niente caos, niente folla, nessun imprevisto",
    heroCtaButton: "Portami via in 30 secondi",
    heroSublabel: "Zona → Mood → Esplora in libertà",
    heroMicroProof: "Ti mostro posti iper selezionati, lontani dal turismo di massa",
    heroMicroProof2: "Tu scegli, io ti porto fuori dai radar",
  },
  en: {
    back: "Back",
    menu: "Menu",
    allCategories: "All categories",
    noHotspots: "No hotspots available.",
    noHotspotsCategory: "No hotspots in this category.",
    loadingError: "Loading error.",
    loadingHotspotsError: "Error loading hotspots.",
    loadingContentError: "Error loading content.",
    missionTitle: "Pipo's Mission",
    meetPipo: "MEET PIPO",
    showDetails: "Show details",
    hideDetails: "Hide details",
    close: "Close",
    previousPhoto: "Previous photo",
    nextPhoto: "Next photo",
    goToPhoto: "Go to photo",
    photo: "Photo",
    filter: "Filter by category",
    noCategoryAvailable: "No category available",
    language: "Language",
    languageIt: "Italiano",
    languageEn: "English",
    // Claim labels
    claimTiAiuta: "IT HELPS YOU:",
    claimQuando: "WHEN:",
    claimRisolve: "IT SOLVES:",
    claimCome: "HOW:",
    // Wizard
    wizardTitle: "Take me away in 30 seconds",
    wizardZona: "Zone",
    wizardMood: "Mood",
    wizardExplore: "Free Exploration",
    wizardYourTurn: "now it's your turn",
    // Explore page
    foundResults: "Found",
    results: "results",
    // Hero section
    heroHeadline: "Alien Explorations in Sicily",
    heroSubheadline: "Find peace off the radar and decide in 30 seconds where to go",
    heroSubheadline2: "Places chosen by a (real) alien: no chaos, no crowds, no surprises",
    heroCtaButton: "Take me away in 30 seconds",
    heroSublabel: "Zone → Mood → Free Exploration",
    heroMicroProof: "I show you ultra-selected places, far from mass tourism",
    heroMicroProof2: "You choose, I take you off the radar",
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
