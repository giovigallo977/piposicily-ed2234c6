import { useState } from "react";
import { Plus, Minus, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Hotspot } from "@/hooks/useHotspots";

interface HotspotCardProps {
  hotspot: Hotspot;
}

const HotspotCard = ({ hotspot }: HotspotCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <article className="bg-card rounded-[20px] overflow-hidden shadow-sm border border-border/50">
      {/* Immagine principale */}
      <div className="aspect-[4/3] bg-muted overflow-hidden">
        {hotspot.foto_principale ? (
          <img
            src={hotspot.foto_principale}
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
          <h2 className="font-heading text-xl font-bold text-foreground leading-tight flex-1 min-w-0">
            {hotspot.titolo}
          </h2>
          
          {/* Categoria e bottone espansione */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {hotspot.categoria && (
              <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                {hotspot.categoria}
              </span>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center transition-all duration-200 hover:bg-secondary/80"
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
        </div>

        {/* Riga Tag */}
        {hotspot.tags && hotspot.tags.length > 0 && (
          <p className="mt-1 font-body text-sm text-foreground">
            {hotspot.tags.map((tag, i) => (
              <span key={i}>• {tag} </span>
            ))}
          </p>
        )}

        {/* Descrizione breve - riga orizzontale completa */}
        <p className="mt-2 font-body text-sm text-muted-foreground leading-relaxed">
          {hotspot.descrizione_breve}
        </p>

        {/* Link Naviga - usa <a> per mobile compatibility */}
        {hotspot.link_google_maps && (
          <a
            href={hotspot.link_google_maps}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 bg-olive text-olive-foreground rounded-lg font-brand font-black italic text-sm transition-all duration-200 hover:bg-olive/90"
          >
            <Navigation className="w-4 h-4" />
            INCONTRA PIPO
          </a>
        )}

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
              {hotspot.descrizione_completa}
            </p>

            {/* Galleria foto */}
            {hotspot.foto_gallery && hotspot.foto_gallery.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {hotspot.foto_gallery.map((foto, index) => (
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
