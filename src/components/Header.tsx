import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Filter, X } from "lucide-react";
import pipoAlien from "@/assets/pipo-alien.png";
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

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/40">
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
        {headerTitle && (
          <h2 className="font-heading text-xl font-bold text-foreground text-center mt-2">
            {headerTitle}
          </h2>
        )}

        {/* Row 3: Subtitle */}
        {headerSubtitle && (
          <p className="font-body text-sm text-foreground text-center mt-1">
            {headerSubtitle}
          </p>
        )}

        {/* Row 4: Hamburger left, Filter right */}
        <div className="flex items-center justify-between mt-3">
          {/* Hamburger Menu - Left */}
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <button
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="Menu"
              >
                <Menu className="w-5 h-5 text-foreground" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] bg-background">
              <SheetHeader>
                <SheetTitle className="font-brand text-xl font-black italic">
                  Menu
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-6">
                <Link
                  to="/missione"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors text-foreground font-medium"
                >
                  La missione di Pipo
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Filter Button - Right */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${
                  selectedCategory 
                    ? "bg-olive text-olive-foreground" 
                    : "hover:bg-muted"
                }`}
                aria-label="Filtra per categoria"
              >
                <Filter className="w-5 h-5" />
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
                Tutte le categorie
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
                  Nessuna categoria disponibile
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
