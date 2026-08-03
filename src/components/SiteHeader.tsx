import { Instagram } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

type Props = {
  activeFilter?: string;
  onFilterClick?: (key: string) => void;
};

const SiteHeader = ({ activeFilter, onFilterClick }: Props) => {
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const handleFilter = (key: string) => {
    if (location.pathname !== "/") {
      navigate("/", { state: { filter: key } });
      return;
    }
    onFilterClick?.(key);
  };

  const navItems: { key: string; label: string; onClick: () => void; active: boolean }[] = [
    { key: "all", label: t("navExploreFreely"), onClick: () => handleFilter("all"), active: location.pathname === "/" && activeFilter === "all" },
    { key: "luoghi fantasma e borghi rurali", label: t("catLuoghiFantasma"), onClick: () => handleFilter("luoghi fantasma e borghi rurali"), active: location.pathname === "/" && activeFilter === "luoghi fantasma e borghi rurali" },
    { key: "Natura", label: t("catNatura"), onClick: () => handleFilter("Natura"), active: location.pathname === "/" && activeFilter === "Natura" },
    { key: "Borghi", label: t("catBorghi"), onClick: () => handleFilter("Borghi"), active: location.pathname === "/" && activeFilter === "Borghi" },
    { key: "Arte e Cultura", label: t("catArteECultura"), onClick: () => handleFilter("Arte e Cultura"), active: location.pathname === "/" && activeFilter === "Arte e Cultura" },
    
    { key: "map", label: t("navMap"), onClick: () => navigate("/mappa"), active: location.pathname === "/mappa" },
    { key: "playlist", label: t("navPlaylist"), onClick: () => navigate("/playlist"), active: location.pathname === "/playlist" },
    { key: "about", label: t("navAbout"), onClick: () => navigate("/about"), active: location.pathname === "/about" },
    { key: "contacts", label: t("navContacts"), onClick: () => navigate("/contatti"), active: location.pathname === "/contatti" },
  ];

  return (
    <>
      <header className="px-6 md:px-12 pt-8 md:pt-12 pb-4 flex items-start justify-between">
        <Link to="/" aria-label="PIPO home" className="flex flex-col flex-1">
          <h1 className="font-sans italic font-black tracking-[-0.02em] leading-[1.0] text-foreground text-6xl md:text-8xl lg:text-9xl">
            Pipo
          </h1>
        </Link>
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLanguage("it")}
              className={cn(
                "font-sans uppercase tracking-widest text-[11px] transition-colors",
                language === "it" ? "text-foreground" : "text-foreground/40 hover:text-foreground/70"
              )}
              aria-label="Italiano"
            >
              IT
            </button>
            <span className="text-foreground/20 text-[10px]">/</span>
            <button
              onClick={() => setLanguage("en")}
              className={cn(
                "font-sans uppercase tracking-widest text-[11px] transition-colors",
                language === "en" ? "text-foreground" : "text-foreground/40 hover:text-foreground/70"
              )}
              aria-label="English"
            >
              EN
            </button>
          </div>
          <a
            href="https://instagram.com/pipo.fuoriradar"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-foreground hover:opacity-70 transition"
          >
            <Instagram className="w-6 h-6" strokeWidth={1.5} />
          </a>
        </div>
      </header>

      <nav className="px-6 md:px-12 pb-10 md:pb-14 border-b border-foreground/10">
        <ul className="flex flex-wrap gap-x-8 gap-y-3 md:gap-x-12 items-center">
          {navItems.map((item) => (
            <li key={item.key}>
              <button
                onClick={item.onClick}
                className={cn(
                  "font-sans uppercase tracking-[0.35em] leading-[1.1] text-[11px] md:text-xs transition-colors",
                  item.active
                    ? "text-foreground font-medium"
                    : "text-foreground/60 font-normal hover:text-foreground"
                )}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default SiteHeader;
