import { useState } from "react";
import { Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
}

const emojiCategories = {
  "Faccine": ["😀", "😊", "😍", "🤩", "😎", "🥳", "😄", "🙂", "😉", "😋", "🤗", "🥰"],
  "Gesti": ["👍", "👏", "🙌", "✌️", "🤝", "👋", "🤙", "💪", "🙏", "👌", "✋", "🤞"],
  "Cuori": ["❤️", "💚", "💛", "💙", "💜", "🧡", "🖤", "🤍", "💕", "💖", "💗", "💝"],
  "Simboli": ["⭐", "🌟", "✨", "🔥", "💥", "⚡", "🎉", "🎊", "🏆", "🎯", "💎", "🌈"],
  "Natura": ["🌿", "🌲", "🌊", "🏔️", "☀️", "🌙", "🌸", "🌺", "🍀", "🌻", "🦋", "🐝"],
  "Cibo": ["🍕", "🍝", "🍷", "☕", "🍦", "🍰", "🍓", "🍇", "🥐", "🧀", "🍔", "🌮"],
  "Viaggi": ["📍", "🗺️", "✈️", "🚗", "🏖️", "⛰️", "🏛️", "🎡", "🚀", "⛵", "🏕️", "🌅"],
};

export function EmojiPicker({ onSelect }: EmojiPickerProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (emoji: string) => {
    onSelect(emoji);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="shrink-0"
        >
          <Smile className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-2" align="end">
        <div className="space-y-3 max-h-[300px] overflow-y-auto">
          {Object.entries(emojiCategories).map(([category, emojis]) => (
            <div key={category}>
              <p className="text-xs text-muted-foreground mb-1 px-1">{category}</p>
              <div className="grid grid-cols-6 gap-1">
                {emojis.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => handleSelect(emoji)}
                    className="p-2 text-xl hover:bg-accent rounded-md transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
