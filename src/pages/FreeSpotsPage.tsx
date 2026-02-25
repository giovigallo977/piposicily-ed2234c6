import { useNavigate } from "react-router-dom";
import { ChevronsLeft, Loader2 } from "lucide-react";
import { useFreeSpots } from "@/hooks/useFreeSpots";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import PremiumModal from "@/components/PremiumModal";
import HotspotCard from "@/components/HotspotCard";
import type { Hotspot } from "@/hooks/useHotspots";

const FreeSpotsPage = () => {
  const navigate = useNavigate();
  const { data: freeSpots, isLoading } = useFreeSpots();
  const { t } = useLanguage();
  const { user, signOut } = useAuth();
  const [premiumModalOpen, setPremiumModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background py-4 px-6 flex items-center justify-between">
        <button onClick={() => navigate("/")} className="p-2 transition-all duration-200 hover:scale-110" aria-label={t("backLabel")}>
          <ChevronsLeft className="w-8 h-8 text-foreground" strokeWidth={2.5} />
        </button>
        <h1 className="font-sans text-xl font-bold text-foreground">Free Spots</h1>
        {!user ? (
          <button onClick={() => setPremiumModalOpen(true)} className="text-sm font-medium text-foreground hover:opacity-70 transition-opacity">
            Login
          </button>
        ) : (
          <button onClick={() => signOut()} className="text-sm font-medium text-foreground hover:opacity-70 transition-opacity">
            Logout
          </button>
        )}
      </header>

      <main className="container mx-auto px-4 py-6 pb-24">
        <div className="max-w-lg mx-auto">
          {isLoading && (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          <div className="space-y-6">
            {freeSpots?.map((spot, index) => (
              <HotspotCard
                key={spot.id}
                hotspot={spot as unknown as Hotspot}
                index={index}
                locked={false}
              />
            ))}
          </div>

          {!isLoading && (!freeSpots || freeSpots.length === 0) && (
            <p className="text-center py-12 text-muted-foreground font-sans italic">
              Nessun free spot ancora.
            </p>
          )}
        </div>
      </main>
      <PremiumModal open={premiumModalOpen} onOpenChange={setPremiumModalOpen} />
    </div>
  );
};

export default FreeSpotsPage;
