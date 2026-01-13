import Header from "@/components/Header";
import HotspotCard from "@/components/HotspotCard";
import { useHotspots } from "@/hooks/useHotspots";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { data: hotspots, isLoading, error } = useHotspots();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-lg mx-auto space-y-6">
          {isLoading && (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          
          {error && (
            <div className="text-center py-12 text-muted-foreground">
              <p>Errore nel caricamento degli hotspot.</p>
            </div>
          )}
          
          {hotspots?.map((hotspot) => (
            <HotspotCard 
              key={hotspot.id} 
              hotspot={{
                id: parseInt(hotspot.id.slice(0, 8), 16),
                titolo: hotspot.titolo,
                descrizioneBreve: hotspot.descrizione_breve,
                descrizioneCompleta: hotspot.descrizione_completa,
                fotoPrincipale: hotspot.foto_principale,
                fotoGallery: hotspot.foto_gallery,
                linkGoogleMaps: hotspot.link_google_maps,
              }} 
            />
          ))}
          
          {!isLoading && hotspots?.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>Nessun hotspot disponibile.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
