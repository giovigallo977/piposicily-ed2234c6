import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronsLeft, Loader2 } from "lucide-react";
import HotspotCard from "@/components/HotspotCard";
import EmailGateModal from "@/components/EmailGateModal";
import LoginModal from "@/components/LoginModal";
import { useHotspots } from "@/hooks/useHotspots";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCardGate } from "@/hooks/useCardGate";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

const ExplorePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data: hotspots, isLoading, error } = useHotspots();
  const { t } = useLanguage();
  const { user, signOut } = useAuth();
  const { onBeforeExpand, gateModalOpen, setGateModalOpen } = useCardGate();

  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const categoriaParam = searchParams.get("categoria");

  const filteredHotspots = useMemo(() => {
    if (!hotspots) return [];
    if (categoriaParam) {
      return hotspots.filter(h => h.categoria === categoriaParam);
    }
    return hotspots;
  }, [hotspots, categoriaParam]);

  const handleBack = () => navigate("/");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background py-4 px-6 flex items-center justify-between">
        <button onClick={handleBack} className="p-2 transition-all duration-200 hover:scale-110" aria-label={t("backLabel")}>
          <ChevronsLeft className="w-8 h-8 text-foreground" strokeWidth={2.5} />
        </button>
        
        <div className="flex items-center gap-2">
          <img alt="Pipo" className="h-10 w-10 object-contain" draggable={false} src="/lovable-uploads/c09259c8-f4e2-4940-b26d-61c1f4a134ae.png" />
        </div>
        {!user ? (
          <button onClick={() => setLoginModalOpen(true)} className="text-sm font-medium text-foreground hover:opacity-70 transition-opacity">
            {t("login")}
          </button>
        ) : (
          <button onClick={async () => { await signOut(); toast({ title: t("loggedOut") }); }} className="text-sm font-medium text-foreground hover:opacity-70 transition-opacity">
            {t("logoutLabel")}
          </button>
        )}
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-6 pb-24">
        <div className="max-w-6xl mx-auto">
          {isLoading && (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          
          {error && (
            <div className="text-center py-12 text-muted-foreground">
              <p>{t("loadingHotspotsError")}</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHotspots.map((hotspot, index) => (
              <HotspotCard
                key={hotspot.id}
                hotspot={hotspot}
                index={index}
                onBeforeExpand={onBeforeExpand}
              />
            ))}
          </div>
          
          {!isLoading && filteredHotspots.length === 0 && hotspots && hotspots.length > 0 && (
            <div className="text-center py-12 text-muted-foreground font-sans italic">
              <p>{t("noHotspotsCategory")}</p>
            </div>
          )}
          
          {!isLoading && hotspots?.length === 0 && (
            <div className="text-center py-12 text-muted-foreground font-sans italic">
              <p>{t("noHotspots")}</p>
            </div>
          )}
        </div>
      </main>

      <EmailGateModal open={gateModalOpen} onOpenChange={setGateModalOpen} />
      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
    </div>
  );
};

export default ExplorePage;
