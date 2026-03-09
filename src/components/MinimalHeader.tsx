import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

import LoginModal from "@/components/LoginModal";

interface MinimalHeaderProps {
  bgColor?: string;
}

const MinimalHeader = ({ bgColor }: MinimalHeaderProps) => {
  const { language, setLanguage, t } = useLanguage();
  const { user, signOut } = useAuth();
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  return (
    <>
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

            {/* Logo centered - "Pipo" in corsivo con alieno */}
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

            {/* Login/Logout - Right */}
            {!user ? (
              <button onClick={() => setLoginModalOpen(true)} className="text-sm font-medium text-foreground hover:opacity-70 transition-opacity">
                {t("login")}
              </button>
            ) : (
              <button onClick={async () => { await signOut(); toast({ title: t("loggedOut") }); }} className="text-sm font-medium text-foreground hover:opacity-70 transition-opacity">
                {t("logoutLabel")}
              </button>
            )}
          </div>
        </div>
      </header>
      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
    </>
  );
};

export default MinimalHeader;
