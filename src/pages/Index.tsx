import { useNavigate } from "react-router-dom";
import MinimalHeader from "@/components/MinimalHeader";
import HeroSection from "@/components/HeroSection";

const Index = () => {
  const navigate = useNavigate();

  const handleOpenWizard = () => {
    navigate("/wizard");
  };

  return (
    <div className="min-h-screen bg-background">
      <MinimalHeader />
      <HeroSection onCtaClick={handleOpenWizard} />
    </div>
  );
};

export default Index;
