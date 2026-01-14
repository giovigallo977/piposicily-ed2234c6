import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

// Cache for translations to avoid repeated API calls
const translationCache = new Map<string, string>();

const getCacheKey = (text: string, targetLang: string) => {
  return `${targetLang}:${text.slice(0, 100)}`;
};

export const useTranslatedContent = (text: string | undefined | null) => {
  const { language } = useLanguage();
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    // If no text or Italian language, return original
    if (!text || language === "it") {
      setTranslatedText(text || null);
      setIsTranslating(false);
      return;
    }

    const cacheKey = getCacheKey(text, language);
    
    // Check cache first
    if (translationCache.has(cacheKey)) {
      setTranslatedText(translationCache.get(cacheKey)!);
      setIsTranslating(false);
      return;
    }

    // Translate via edge function
    const translate = async () => {
      setIsTranslating(true);
      try {
        const { data, error } = await supabase.functions.invoke("translate", {
          body: { text, targetLanguage: language },
        });

        if (error) {
          console.error("Translation error:", error);
          setTranslatedText(text);
        } else if (data?.translatedText) {
          translationCache.set(cacheKey, data.translatedText);
          setTranslatedText(data.translatedText);
        } else {
          setTranslatedText(text);
        }
      } catch (err) {
        console.error("Translation error:", err);
        setTranslatedText(text);
      } finally {
        setIsTranslating(false);
      }
    };

    translate();
  }, [text, language]);

  return { translatedText, isTranslating };
};

// Hook for batch translations (useful for hotspot cards)
export const useTranslatedHotspot = (hotspot: {
  titolo: string;
  descrizione_breve: string;
  descrizione_completa: string;
  categoria: string | null;
}) => {
  const { language } = useLanguage();
  const [translated, setTranslated] = useState({
    titolo: hotspot.titolo,
    descrizione_breve: hotspot.descrizione_breve,
    descrizione_completa: hotspot.descrizione_completa,
    categoria: hotspot.categoria,
  });
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    if (language === "it") {
      setTranslated({
        titolo: hotspot.titolo,
        descrizione_breve: hotspot.descrizione_breve,
        descrizione_completa: hotspot.descrizione_completa,
        categoria: hotspot.categoria,
      });
      setIsTranslating(false);
      return;
    }

    const translateAll = async () => {
      setIsTranslating(true);
      
      // Check if all are cached
      const cacheKeys = {
        titolo: getCacheKey(hotspot.titolo, language),
        descrizione_breve: getCacheKey(hotspot.descrizione_breve, language),
        descrizione_completa: getCacheKey(hotspot.descrizione_completa, language),
        categoria: hotspot.categoria ? getCacheKey(hotspot.categoria, language) : null,
      };

      const allCached = 
        translationCache.has(cacheKeys.titolo) &&
        translationCache.has(cacheKeys.descrizione_breve) &&
        translationCache.has(cacheKeys.descrizione_completa) &&
        (!cacheKeys.categoria || translationCache.has(cacheKeys.categoria));

      if (allCached) {
        setTranslated({
          titolo: translationCache.get(cacheKeys.titolo)!,
          descrizione_breve: translationCache.get(cacheKeys.descrizione_breve)!,
          descrizione_completa: translationCache.get(cacheKeys.descrizione_completa)!,
          categoria: cacheKeys.categoria ? translationCache.get(cacheKeys.categoria)! : hotspot.categoria,
        });
        setIsTranslating(false);
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke("translate", {
          body: { 
            texts: {
              titolo: hotspot.titolo,
              descrizione_breve: hotspot.descrizione_breve,
              descrizione_completa: hotspot.descrizione_completa,
              categoria: hotspot.categoria,
            },
            targetLanguage: language,
            batch: true,
          },
        });

        if (error) {
          console.error("Batch translation error:", error);
          setTranslated({
            titolo: hotspot.titolo,
            descrizione_breve: hotspot.descrizione_breve,
            descrizione_completa: hotspot.descrizione_completa,
            categoria: hotspot.categoria,
          });
        } else if (data?.translations) {
          // Cache results
          Object.entries(data.translations).forEach(([key, value]) => {
            const original = hotspot[key as keyof typeof hotspot];
            if (original && typeof value === 'string') {
              translationCache.set(getCacheKey(original, language), value);
            }
          });
          setTranslated(data.translations);
        }
      } catch (err) {
        console.error("Batch translation error:", err);
      } finally {
        setIsTranslating(false);
      }
    };

    translateAll();
  }, [hotspot.titolo, hotspot.descrizione_breve, hotspot.descrizione_completa, hotspot.categoria, language]);

  return { translated, isTranslating };
};
