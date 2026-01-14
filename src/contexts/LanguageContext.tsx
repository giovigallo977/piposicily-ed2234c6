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
