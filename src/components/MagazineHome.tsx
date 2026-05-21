import { useMemo, useState } from "react";
import { Instagram, Loader2, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import HotspotCard from "@/components/HotspotCard";
import EmailGateModal from "@/components/EmailGateModal";
import { useHotspots, type Hotspot } from "@/hooks/useHotspots";
import { useFreeSpots } from "@/hooks/useFreeSpots";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCardGate } from "@/hooks/useCardGate";
import { cn } from "@/lib/utils";

type Filter =
  | "all"
  | "Luoghi Fantasma"
  | "Natura"
  | "Borghi"
  | "Arte e Cultura"
  | "free-spots";

const MagazineHome = () => {
  const { t, language, setLanguage } = useLanguage();
  const [filter, setFilter] = useState<Filter>("all");
  const [aboutOpen, setAboutOpen] = useState(false);
  const [contactsOpen, setContactsOpen] = useState(false);

  const { data: hotspots, isLoading: loadingHotspots } = useHotspots();
  const { data: freeSpots, isLoading: loadingFree } = useFreeSpots();
  const { onBeforeExpand, gateModalOpen, setGateModalOpen, onEmailProvided, gateSource } = useCardGate();

  const items = useMemo<Hotspot[]>(() => {
    if (filter === "free-spots") return (freeSpots || []) as unknown as Hotspot[];
    if (filter === "all") return (hotspots || []).filter(h => h.categoria !== "Free Spots");
    return (hotspots || []).filter(h => h.categoria === filter);
  }, [filter, hotspots, freeSpots]);

  const isLoading = filter === "free-spots" ? loadingFree : loadingHotspots;

  const navItems: { key: string; label: string; onClick: () => void; active: boolean }[] = [
    { key: "all", label: t("navExploreFreely"), onClick: () => setFilter("all"), active: filter === "all" },
    { key: "Luoghi Fantasma", label: t("catLuoghiFantasma"), onClick: () => setFilter("Luoghi Fantasma"), active: filter === "Luoghi Fantasma" },
    { key: "Natura", label: t("catNatura"), onClick: () => setFilter("Natura"), active: filter === "Natura" },
    { key: "Borghi", label: t("catBorghi"), onClick: () => setFilter("Borghi"), active: filter === "Borghi" },
    { key: "Arte e Cultura", label: t("catArteECultura"), onClick: () => setFilter("Arte e Cultura"), active: filter === "Arte e Cultura" },
    { key: "free-spots", label: t("navFreeSpots"), onClick: () => setFilter("free-spots"), active: filter === "free-spots" },
    { key: "about", label: t("navAbout"), onClick: () => setAboutOpen(true), active: false },
    { key: "contacts", label: t("navContacts"), onClick: () => setContactsOpen(true), active: false },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar with PIPO logo + IG */}
      <header className="px-6 md:px-12 pt-8 md:pt-12 pb-4 flex items-start justify-between">
        <h1 className="font-garet font-normal tracking-tight leading-none text-foreground text-6xl md:text-8xl lg:text-9xl">
          PIPO
        </h1>
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

      {/* Navigation */}
      <nav className="px-6 md:px-12 pb-10 md:pb-14 border-b border-foreground/10">
        <ul className="flex flex-wrap gap-x-6 gap-y-3 md:gap-x-10 items-center">
          {navItems.map((item) => (
            <li key={item.key}>
              <button
                onClick={item.onClick}
                className={cn(
                  "font-sans uppercase tracking-widest text-[11px] md:text-xs transition-colors",
                  item.active
                    ? "text-foreground font-semibold"
                    : "text-foreground/60 hover:text-foreground"
                )}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Grid */}
      <main className="px-6 md:px-12 py-10 md:py-14 pb-24">
        {isLoading && (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-foreground/60" />
          </div>
        )}

        {!isLoading && items.length === 0 && (
          <p className="text-center py-20 text-muted-foreground font-sans italic">
            {filter === "free-spots" ? t("noFreeSpots") : t("noHotspotsCategory")}
          </p>
        )}

        {!isLoading && items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {items.map((hotspot, i) => (
              <HotspotCard
                key={hotspot.id}
                hotspot={hotspot}
                index={i}
                onBeforeExpand={filter === "free-spots" ? undefined : onBeforeExpand}
              />
            ))}
          </div>
        )}
      </main>

      {/* About modal */}
      <Dialog open={aboutOpen} onOpenChange={setAboutOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-3xl md:text-4xl font-light">
              {t("navAbout")}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 mt-2 font-sans text-sm md:text-base leading-relaxed text-foreground whitespace-pre-line">
            <section>
              <h3 className="font-bold mb-2">👽 {t("aboutChiTitle")}</h3>
              <p>{t("aboutChiBody")}</p>
            </section>
            <section>
              <h3 className="font-bold mb-2">🌊 {t("aboutPerChiTitle")}</h3>
              <p>{t("aboutPerChiBody")}</p>
            </section>
            <section>
              <h3 className="font-bold mb-2">👽 {t("aboutAlienoTitle")}</h3>
              <p>{t("aboutAlienoBody")}</p>
            </section>
            <section>
              <h3 className="font-bold mb-2">🌱 {t("aboutPrincipioTitle")}</h3>
              <p>{t("aboutPrincipioBody")}</p>
            </section>
          </div>
        </DialogContent>
      </Dialog>

      {/* Contacts modal */}
      <Dialog open={contactsOpen} onOpenChange={setContactsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-3xl font-light">
              {t("contactsTitle")}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2 font-sans text-base">
            <a
              href="https://instagram.com/pipo.fuoriradar"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-foreground hover:opacity-70 transition"
            >
              {t("contactsIg")}
            </a>
            <a
              href="mailto:pipoesplora@gmail.com"
              className="block text-foreground hover:opacity-70 transition"
            >
              {t("contactsEmail")}
            </a>
          </div>
        </DialogContent>
      </Dialog>

      <EmailGateModal open={gateModalOpen} onOpenChange={setGateModalOpen} onEmailProvided={onEmailProvided} source={gateSource} />
    </div>
  );
};

export default MagazineHome;
