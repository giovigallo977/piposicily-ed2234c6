import { useEffect } from "react";
import MinimalHeader from "@/components/MinimalHeader";
import HeroSection from "@/components/HeroSection";
import { useSiteContent } from "@/hooks/useSiteContent";
import { trackEvent } from "@/lib/trackEvent";
const Index = () => {
  useEffect(() => { trackEvent("page_view"); }, []);
  const { data: homepageBgColorContent } = useSiteContent("homepage_bg_color");
  
  const bgColor = homepageBgColorContent?.content;

  return (
    <div 
      className="pb-16 overflow-x-hidden"
      style={{ backgroundColor: bgColor || undefined }}
    >
      <MinimalHeader bgColor={bgColor} />
      <HeroSection bgColor={bgColor} />
    </div>
  );
};

export default Index;
