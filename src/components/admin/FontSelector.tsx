import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { AVAILABLE_FONTS, FONT_WEIGHTS, FONT_SIZE_SCALE } from "@/types/styles";

interface FontSelectorProps {
  label: string;
  fontValue: string;
  onFontChange: (value: string) => void;
  weightValue: number;
  onWeightChange: (value: number) => void;
  sizeValue: string;
  onSizeChange: (value: string) => void;
  showSizeInput?: boolean; // Show numeric input instead of dropdown
}

export const FontSelector = ({
  label,
  fontValue,
  onFontChange,
  weightValue,
  onWeightChange,
  sizeValue,
  onSizeChange,
  showSizeInput = true,
}: FontSelectorProps) => {
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

        {/* Size - Numeric Input or Dropdown */}
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Dimensione (px)</Label>
          {showSizeInput ? (
            <Input
              type="number"
              min={10}
              max={72}
              value={sizeValue}
              onChange={(e) => onSizeChange(e.target.value)}
              className="h-9 text-xs"
              placeholder="16"
            />
          ) : (
            <Select value={sizeValue} onValueChange={onSizeChange}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Dimensione" />
              </SelectTrigger>
              <SelectContent>
                {FONT_SIZE_SCALE.map((size) => (
                  <SelectItem key={size.value} value={size.value}>
                    {size.label}px
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Weight - 3 levels */}
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Peso</Label>
          <Select value={String(weightValue)} onValueChange={(v) => onWeightChange(Number(v))}>
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="Peso" />
            </SelectTrigger>
            <SelectContent>
              {FONT_WEIGHTS.map((weight) => (
                <SelectItem key={weight.value} value={String(weight.value)}>
                  {weight.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Preview */}
      <div 
        className="p-2 bg-background rounded border text-center"
        style={{ 
          fontFamily: fontValue,
          fontWeight: weightValue,
          fontSize: `${sizeValue}px`,
        }}
      >
        Anteprima testo
      </div>
    </div>
  );
};
