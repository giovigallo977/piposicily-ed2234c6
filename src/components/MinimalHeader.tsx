import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import pipoAlien from "@/assets/pipo-alien-new.png";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const MinimalHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="bg-background py-4">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Hamburger Menu - Left */}
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <button
                className="p-2 rounded-full transition-all duration-200 hover:scale-110 bg-transparent"
                aria-label={t("menu")}
              >
                <Menu className="w-6 h-6 text-black" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] bg-background flex flex-col">
              <SheetHeader>
                <SheetTitle className="font-bubbles text-xl">
                  {t("menu")}
                </SheetTitle>
              </SheetHeader>
              
              {/* Navigation links */}
              <nav className="mt-6 flex-1">
                <Link
                  to="/missione"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors text-foreground font-sans font-bold italic text-lg"
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

          {/* Logo centered - "Pipo" in corsivo con alieno */}
          <div className="flex items-center">
            <h1 className="font-sans text-xl font-bold italic tracking-tight text-foreground">
              Pipo
            </h1>
            <img
              src={pipoAlien}
              alt="Logo Pipo"
              className="h-10 w-10 object-contain ml-2"
              draggable={false}
            />
          </div>

          {/* Empty space for balance */}
          <div className="w-10" />
        </div>
      </div>
    </header>
  );
};

export default MinimalHeader;
