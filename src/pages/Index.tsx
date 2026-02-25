import MinimalHeader from "@/components/MinimalHeader";
import HeroSection from "@/components/HeroSection";
import { useSiteContent } from "@/hooks/useSiteContent";
const Index = () => {
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
