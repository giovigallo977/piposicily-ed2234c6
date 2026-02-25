import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronsLeft, Loader2 } from "lucide-react";
import { useCollections } from "@/hooks/useCollections";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import LoginModal from "@/components/LoginModal";

const CollectionsPage = () => {
  const navigate = useNavigate();
  const { data: collections, isLoading } = useCollections();
  const { t, language } = useLanguage();
  const { user, signOut } = useAuth();
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background py-4 px-6 flex items-center justify-between">
        <button onClick={() => navigate("/")} className="p-2 transition-all duration-200 hover:scale-110" aria-label={t("backLabel")}>
          <ChevronsLeft className="w-8 h-8 text-foreground" strokeWidth={2.5} />
        </button>
        <h1 className="font-sans text-xl font-bold text-foreground">{t("collections")}</h1>
        {!user ? (
          <button onClick={() => setLoginModalOpen(true)} className="text-sm font-medium text-foreground hover:opacity-70 transition-opacity">
            Login
          </button>
        ) : (
          <button onClick={async () => { await signOut(); toast({ title: language === "it" ? "Sei uscito" : "Logged out" }); }} className="text-sm font-medium text-foreground hover:opacity-70 transition-opacity">
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

          <div className="grid grid-cols-2 gap-3">
            {collections?.map((collection) => (
              <button
                key={collection.id}
                onClick={() => navigate(`/collezioni/${collection.id}`)}
                className="relative aspect-square rounded-2xl overflow-hidden group focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {collection.immagine ? (
                  <img
                    src={collection.immagine}
                    alt={collection.nome}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-muted" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <span className="absolute bottom-3 left-3 right-3 text-white font-sans text-sm md:text-base font-bold text-left leading-tight drop-shadow-lg">
                  {collection.nome}
                </span>
              </button>
            ))}
          </div>

          {!isLoading && collections?.length === 0 && (
            <div className="text-center py-12 text-muted-foreground font-sans italic">
              <p>{t("noCollections")}</p>
            </div>
          )}
        </div>
      </main>
      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
    </div>
  );
};

export default CollectionsPage;
