import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface CollectionInlineBlockProps {
  onContinue: () => void;
}

const CollectionInlineBlock = ({ onContinue }: CollectionInlineBlockProps) => {
  const { t } = useLanguage();

  return (
    <div className="col-span-full flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="max-w-sm mx-auto">
        <p className="text-3xl mb-3">🧭</p>
        <h3 className="font-sans text-lg font-bold text-foreground mb-2">
          {t("inlineBlockTitle")}
        </h3>
        <Button onClick={onContinue} className="font-bold mt-2">
          {t("gateCta")}
        </Button>
      </div>
    </div>
  );
};

export default CollectionInlineBlock;
