import { useEffect } from "react";
import { trackEvent } from "@/lib/trackEvent";
import MagazineHome from "@/components/MagazineHome";

const Index = () => {
  useEffect(() => { trackEvent("page_view"); }, []);

  return <MagazineHome />;
};

export default Index;
