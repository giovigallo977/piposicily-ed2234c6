import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { trackEvent } from "@/lib/trackEvent";

const Index = () => {
  useEffect(() => { trackEvent("page_view"); }, []);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Minimal logo */}
      <div className="px-6 pt-6">
        <span className="font-heading text-2xl">Pipo</span>
      </div>

      {/* Selector */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-2xl mx-auto w-full gap-8">
        <h1 className="text-2xl md:text-4xl font-bold text-center leading-tight">
          Scegli come vivere la tua giornata
        </h1>

        <div className="flex flex-col md:flex-row gap-5 w-full">
          {/* Card Self Guided */}
          <button
            onClick={() => navigate("/self-guided")}
            className="flex-1 border border-border rounded-xl p-6 text-left hover:shadow-md transition-shadow bg-card"
          >
            <p className="text-xl font-bold mb-2">Esplora in autonomia</p>
            <p className="text-muted-foreground">
              Itinerari già pronti, zero tempo perso
            </p>
            <p className="mt-4 font-bold" style={{ color: "hsl(var(--cta-yellow-foreground))" }}>
              Vedi gli itinerari →
            </p>
          </button>

          {/* Card Experience */}
          <button
            onClick={() => navigate("/experience")}
            className="flex-1 border border-border rounded-xl p-6 text-left hover:shadow-md transition-shadow bg-card"
          >
            <p className="text-xl font-bold mb-2">Non vuoi organizzare nulla?</p>
            <p className="text-muted-foreground">
              Ti portiamo noi, in piccoli gruppi
            </p>
            <p className="mt-4 font-bold" style={{ color: "hsl(var(--cta-yellow-foreground))" }}>
              Scopri le experience →
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;
