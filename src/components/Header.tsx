import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Filter } from "lucide-react";
import pipoAlien from "@/assets/pipo-alien.png";
import { useTranslatedContent } from "@/hooks/useTranslation";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface HeaderProps {
  categories?: string[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  headerTitle?: string;
  headerSubtitle?: string;
}

const Header = ({ categories = [], selectedCategory, onCategoryChange, headerTitle, headerSubtitle }: HeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  
  // Translate dynamic content
  const { translatedText: translatedTitle, isTranslating: titleLoading } = useTranslatedContent(headerTitle);
  const { translatedText: translatedSubtitle, isTranslating: subtitleLoading } = useTranslatedContent(headerSubtitle);

  return (
    <header className="sticky top-0 z-50 bg-background backdrop-blur-sm border-b border-border/30">
      <div className="container mx-auto px-6 py-4">
        {/* Row 1: Logo centered */}
        <div className="flex items-center justify-center">
          <h1 className="font-brand text-2xl font-black italic tracking-tight text-foreground">
            Pipo
          </h1>
          <img
            src={pipoAlien}
            alt="Logo Pipo"
            className="h-9 w-9 object-contain ml-2"
            draggable={false}
          />
        </div>

        {/* Row 2: Title */}
        {(headerTitle || translatedTitle) && (
          <h2 className={`font-heading text-xl font-bold text-foreground text-center mt-2 transition-opacity ${titleLoading ? 'opacity-50' : ''}`}>
            {translatedTitle || headerTitle}
          </h2>
        )}

        {/* Row 3: Subtitle */}
        {(headerSubtitle || translatedSubtitle) && (
          <p className={`font-body font-medium text-base text-foreground text-center mt-1 transition-opacity ${subtitleLoading ? 'opacity-50' : ''}`}>
            {translatedSubtitle || headerSubtitle}
          </p>
        )}

        {/* Row 4: Hamburger left, Filter right */}
        <div className="flex items-center justify-between mt-3">
          {/* Hamburger Menu - Left */}
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <button
                className="p-2.5 rounded-full bg-sunny-yellow hover:bg-sunny-yellow/80 transition-all duration-200 hover:scale-110 hover:rotate-3 shadow-md hover:shadow-lg"
                aria-label={t("menu")}
              >
                <Menu className="w-5 h-5 text-forest-green" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] bg-background flex flex-col">
              <SheetHeader>
                <SheetTitle className="font-brand text-xl font-black italic">
                  {t("menu")}
                </SheetTitle>
              </SheetHeader>
              
              {/* Navigation links */}
              <nav className="mt-6 flex-1">
                <Link
                  to="/missione"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors text-foreground font-medium"
                >
                  {t("missionTitle")}
                </Link>
              </nav>

              {/* Language selector at bottom */}
              <div className="pt-4 border-t border-border/30">
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
              </div>
            </SheetContent>
          </Sheet>

          {/* Filter Button - Right */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`p-2.5 rounded-full transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg hover:scale-110 hover:-rotate-3 ${
                  selectedCategory 
                    ? "bg-magenta text-white" 
                    : "bg-lavender-vivid hover:bg-lavender-vivid/80"
                }`}
                aria-label={t("filter")}
              >
                <Filter className={`w-5 h-5 ${selectedCategory ? "text-white" : "text-purple-900"}`} />
                {selectedCategory && (
                  <span className="text-sm font-medium">{selectedCategory}</span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-background border border-border">
              <DropdownMenuItem
                onClick={() => onCategoryChange(null)}
                className={`cursor-pointer ${!selectedCategory ? "bg-muted" : ""}`}
              >
                {t("allCategories")}
              </DropdownMenuItem>
              {categories.map((category) => (
                <DropdownMenuItem
                  key={category}
                  onClick={() => onCategoryChange(category)}
                  className={`cursor-pointer ${selectedCategory === category ? "bg-muted" : ""}`}
                >
                  {category}
                </DropdownMenuItem>
              ))}
              {categories.length === 0 && (
                <DropdownMenuItem disabled className="text-muted-foreground">
                  {t("noCategoryAvailable")}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
