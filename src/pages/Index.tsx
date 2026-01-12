import Header from "@/components/Header";
import HotspotCard from "@/components/HotspotCard";
import { hotspots } from "@/data/hotspots";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-lg mx-auto space-y-6">
          {hotspots.map((hotspot) => (
            <HotspotCard key={hotspot.id} hotspot={hotspot} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
