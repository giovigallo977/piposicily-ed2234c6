import { Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";
import pipoAlien from "@/assets/pipo-alien.png";

const Mission = () => {
  const { data: missionContent, isLoading, error } = useSiteContent("mission");

  return (
    <div className="min-h-screen bg-background">
      {/* Header with back button */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/40">
        <div className="container mx-auto px-6 py-4">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Indietro</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Pipo logo centered */}
          <div className="flex flex-col items-center mb-10">
            <img
              src={pipoAlien}
              alt="Pipo"
              className="h-20 w-20 object-contain mb-4"
              draggable={false}
            />
            <h1 className="font-brand text-3xl font-black italic tracking-tight text-foreground">
              La missione di Pipo
            </h1>
          </div>

          {/* Content */}
          {isLoading && (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {error && (
            <div className="text-center py-12 text-muted-foreground">
              <p>Errore nel caricamento del contenuto.</p>
            </div>
          )}

          {missionContent && (
            <div className="prose prose-lg max-w-none">
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                {missionContent.content}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Mission;
