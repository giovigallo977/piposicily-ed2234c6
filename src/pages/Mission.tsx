import { Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslatedContent } from "@/hooks/useTranslation";
import pipoAlien from "@/assets/pipo-alien-new.png";
const Mission = () => {
  const {
    data: missionContent,
    isLoading,
    error
  } = useSiteContent("mission");
  const {
    t
  } = useLanguage();
  const {
    translatedText: translatedMission,
    isTranslating
  } = useTranslatedContent(missionContent?.content);
  return <div className="min-h-screen bg-background">
      {/* Header with back button */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/40">
        <div className="container mx-auto px-6 py-4">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">{t("back")}</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-md mx-auto">
          {/* Pipo logo centered - using new alien from homepage */}
          <div className="flex flex-col items-center mb-10">
            <img src={pipoAlien} alt="Pipo" className="h-16 w-16 object-contain mb-6" draggable={false} />
            {/* Title in Rubik Bubbles like homepage */}
            <h1 className="font-bubbles text-[28px] text-foreground text-center">
              {t("missionTitle")}
            </h1>
          </div>

          {/* Content */}
          {isLoading && <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>}

          {error && <div className="text-center py-12 text-muted-foreground">
              <p>{t("loadingContentError")}</p>
            </div>}

          {missionContent && <div className={`transition-opacity ${isTranslating ? 'opacity-50' : ''}`}>
              {/* Text in Inter 22 bold italic like mockup */}
              <p className="font-medium text-foreground leading-relaxed whitespace-pre-wrap font-sans text-center text-base">
                {translatedMission || missionContent.content}
              </p>
            </div>}
        </div>
      </main>
    </div>;
};
export default Mission;