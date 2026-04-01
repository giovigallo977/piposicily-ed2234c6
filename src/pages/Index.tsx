import { useEffect } from "react";
import { trackEvent } from "@/lib/trackEvent";
import HeroSection from "@/components/HeroSection";
import MinimalHeader from "@/components/MinimalHeader";

const Index = () => {
  useEffect(() => { trackEvent("page_view"); }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <MinimalHeader />
      <HeroSection />
    </div>
  );
};

export default Index;
