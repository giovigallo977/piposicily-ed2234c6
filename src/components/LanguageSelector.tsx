import { useLanguage, Language } from "@/contexts/LanguageContext";

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
      <button
        onClick={() => setLanguage("it")}
        className={`px-2 py-1 rounded transition-colors ${
          language === "it"
            ? "text-foreground font-medium"
            : "hover:text-foreground/70"
        }`}
      >
        IT
      </button>
      <span className="text-border">|</span>
      <button
        onClick={() => setLanguage("en")}
        className={`px-2 py-1 rounded transition-colors ${
          language === "en"
            ? "text-foreground font-medium"
            : "hover:text-foreground/70"
        }`}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSelector;
