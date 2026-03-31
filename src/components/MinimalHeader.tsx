import { useLanguage } from "@/contexts/LanguageContext";

interface MinimalHeaderProps {
  bgColor?: string;
}

const MinimalHeader = ({ bgColor }: MinimalHeaderProps) => {
  const { language, setLanguage } = useLanguage();

  return (
    <header className="py-4" style={{ backgroundColor: bgColor || undefined }}>
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Language selector - Left (compact) */}
          <div className="flex items-center gap-0.5 text-xs text-muted-foreground">
            <button
              onClick={() => setLanguage("it")}
              className={`px-1.5 py-0.5 rounded transition-colors ${
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
              className={`px-1.5 py-0.5 rounded transition-colors ${
                language === "en"
                  ? "text-foreground font-medium"
                  : "hover:text-foreground/70"
              }`}
            >
              EN
            </button>
          </div>

          {/* Logo centered */}
          <div className="flex items-center">
            <h1 className="font-sans font-bold italic tracking-tight text-foreground text-2xl">
              Pipo
            </h1>
            <img
              alt="Logo Pipo"
              className="h-10 w-10 object-contain ml-2"
              draggable={false}
              src="/lovable-uploads/b7314684-1685-40ef-a475-e9249bc1e1c2.png"
            />
          </div>

          {/* Empty right slot for balance */}
          <div className="w-10" />
        </div>
      </div>
    </header>
  );
};

export default MinimalHeader;
