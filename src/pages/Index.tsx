import { useNavigate } from "react-router-dom";
import MinimalHeader from "@/components/MinimalHeader";
import HeroSection from "@/components/HeroSection";
import { useSiteContent } from "@/hooks/useSiteContent";

const Index = () => {
  const navigate = useNavigate();
  const { data: homepageBgColorContent } = useSiteContent("homepage_bg_color");
  
  const bgColor = homepageBgColorContent?.content;

  const handleOpenWizard = () => {
    navigate("/wizard");
  };

  return (
    <div 
      className="pb-16"
      style={{ backgroundColor: bgColor || undefined }}
    >
      <MinimalHeader bgColor={bgColor} />
      <HeroSection onCtaClick={handleOpenWizard} bgColor={bgColor} />
    </div>
  );
};

export default Index;
