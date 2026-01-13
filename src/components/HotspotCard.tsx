import { useState } from "react";
import { Plus, Minus, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Hotspot } from "@/data/hotspots";

interface HotspotCardProps {
  hotspot: Hotspot;
}

const HotspotCard = ({ hotspot }: HotspotCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleNavigate = () => {
    window.open(hotspot.linkGoogleMaps, "_blank", "noopener,noreferrer");
  };

  return (
    <article className="bg-card rounded-[20px] overflow-hidden shadow-sm border border-border/50">
      {/* Immagine principale */}
      <div className="aspect-[4/3] bg-muted overflow-hidden">
        {hotspot.fotoPrincipale ? (
          <img
            src={hotspot.fotoPrincipale}
            alt={hotspot.titolo}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <span className="text-muted-foreground text-sm">Foto</span>
          </div>
        )}
      </div>

      {/* Contenuto */}
      <div className="p-5">
        {/* Header con titolo e bottone espansione */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="font-heading text-xl font-bold text-foreground leading-tight">
              {hotspot.titolo}
            </h2>
            <p className="mt-1.5 font-body text-sm text-muted-foreground line-clamp-1">
              {hotspot.descrizioneBreve}
            </p>
          </div>
          
          {/* Bottone espansione */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center transition-all duration-200 hover:bg-secondary/80"
            aria-expanded={isExpanded}
            aria-label={isExpanded ? "Chiudi dettagli" : "Mostra dettagli"}
          >
            {isExpanded ? (
              <Minus className="w-4 h-4 text-foreground" />
            ) : (
              <Plus className="w-4 h-4 text-foreground" />
            )}
          </button>
        </div>

        {/* Bottone Naviga */}
        <button
          onClick={handleNavigate}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 bg-olive text-olive-foreground rounded-lg font-medium text-sm transition-all duration-200 hover:bg-olive/90"
        >
          <Navigation className="w-4 h-4" />
          NAVIGA
        </button>

        {/* Contenuto espanso con accordion */}
        <div
          className={cn(
            "grid transition-all duration-300 ease-out",
            isExpanded ? "grid-rows-[1fr] opacity-100 mt-5" : "grid-rows-[0fr] opacity-0"
          )}
        >
          <div className="overflow-hidden">
            {/* Descrizione completa */}
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              {hotspot.descrizioneCompleta}
            </p>

            {/* Galleria foto */}
            {hotspot.fotoGallery.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {hotspot.fotoGallery.map((foto, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-lg overflow-hidden bg-muted"
                  >
                    {foto ? (
                      <img
                        src={foto}
                        alt={`${hotspot.titolo} - foto ${index + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-muted-foreground text-xs">
                          {index + 1}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default HotspotCard;
