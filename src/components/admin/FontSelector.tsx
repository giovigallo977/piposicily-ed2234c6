import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { AVAILABLE_FONTS, FONT_SIZES } from "@/types/styles";

interface FontSelectorProps {
  label: string;
  fontValue: string;
  onFontChange: (value: string) => void;
  boldValue: boolean;
  onBoldChange: (value: boolean) => void;
  sizeValue: string;
  onSizeChange: (value: string) => void;
  sizeType: 'title' | 'body' | 'button';
}

export const FontSelector = ({
  label,
  fontValue,
  onFontChange,
  boldValue,
  onBoldChange,
  sizeValue,
  onSizeChange,
  sizeType,
}: FontSelectorProps) => {
  const sizes = FONT_SIZES[sizeType];

  return (
    <div className="space-y-3 p-3 bg-muted/50 rounded-lg">
      <Label className="text-sm font-semibold">{label}</Label>
      
      <div className="grid grid-cols-3 gap-3">
        {/* Font Family */}
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Font</Label>
          <Select value={fontValue} onValueChange={onFontChange}>
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="Seleziona font" />
            </SelectTrigger>
            <SelectContent>
              {AVAILABLE_FONTS.map((font) => (
                <SelectItem 
                  key={font.value} 
                  value={font.value}
                  style={{ fontFamily: font.value }}
                >
                  {font.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Size */}
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Dimensione</Label>
          <Select value={sizeValue} onValueChange={onSizeChange}>
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="Dimensione" />
            </SelectTrigger>
            <SelectContent>
              {sizes.map((size) => (
                <SelectItem key={size.value} value={size.value}>
                  {size.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Bold */}
        <div className="flex items-end pb-1">
          <div className="flex items-center gap-2">
            <Checkbox
              id={`bold-${label}`}
              checked={boldValue}
              onCheckedChange={(checked) => onBoldChange(checked === true)}
            />
            <Label htmlFor={`bold-${label}`} className="text-xs font-medium cursor-pointer">
              Bold
            </Label>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div 
        className="p-2 bg-background rounded border text-center"
        style={{ 
          fontFamily: fontValue,
          fontWeight: boldValue ? 700 : 400,
        }}
      >
        <span className={`text-${sizeValue}`}>
          Anteprima testo
        </span>
      </div>
    </div>
  );
};
