import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

// Cache for category translations
const categoryTranslationCache = new Map<string, string>();

export const useTranslatedCategories = (categories: string[]) => {
  const { language } = useLanguage();
  const [translatedCategories, setTranslatedCategories] = useState<string[]>(categories);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    // If Italian or no categories, return originals
    if (language === "it" || categories.length === 0) {
      setTranslatedCategories(categories);
      setIsTranslating(false);
      return;
    }

    // Check if all are cached
    const allCached = categories.every((cat) =>
      categoryTranslationCache.has(`${language}:${cat}`)
    );

    if (allCached) {
      setTranslatedCategories(
        categories.map((cat) => categoryTranslationCache.get(`${language}:${cat}`)!)
      );
      setIsTranslating(false);
      return;
    }

    // Translate via edge function
    const translateCategories = async () => {
      setIsTranslating(true);
      try {
        const { data, error } = await supabase.functions.invoke("translate", {
          body: {
            text: categories.join("|||"),
            targetLanguage: language,
          },
        });

        if (error) {
          console.error("Category translation error:", error);
          setTranslatedCategories(categories);
        } else if (data?.translatedText) {
          const translated = data.translatedText.split("|||").map((t: string) => t.trim());
          // Cache results
          categories.forEach((cat, i) => {
            if (translated[i]) {
              categoryTranslationCache.set(`${language}:${cat}`, translated[i]);
            }
          });
          setTranslatedCategories(translated.length === categories.length ? translated : categories);
        } else {
          setTranslatedCategories(categories);
        }
      } catch (err) {
        console.error("Category translation error:", err);
        setTranslatedCategories(categories);
      } finally {
        setIsTranslating(false);
      }
    };

    translateCategories();
  }, [categories.join(","), language]);

  // Helper to get original category from translated
  const getOriginalCategory = (translatedCategory: string): string => {
    const index = translatedCategories.indexOf(translatedCategory);
    return index >= 0 ? categories[index] : translatedCategory;
  };

  // Helper to get translated category from original
  const getTranslatedCategory = (originalCategory: string): string => {
    const index = categories.indexOf(originalCategory);
    return index >= 0 ? translatedCategories[index] : originalCategory;
  };

  return {
    translatedCategories,
    getOriginalCategory,
    getTranslatedCategory,
    isTranslating,
  };
};
