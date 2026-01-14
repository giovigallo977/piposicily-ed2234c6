import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface ClaimItem {
  id: string;
  label: string;
  content: string;
}

interface SortableClaimItemProps {
  claim: ClaimItem;
  onUpdate: (id: string, field: "label" | "content", value: string) => void;
  onDelete: (id: string) => void;
  canDelete: boolean;
}

export const SortableClaimItem = ({ claim, onUpdate, onDelete, canDelete }: SortableClaimItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: claim.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border border-border/50"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
        aria-label="Trascina per riordinare"
      >
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </button>
      
      <Input
        value={claim.label}
        onChange={(e) => onUpdate(claim.id, "label", e.target.value)}
        placeholder="Etichetta (es: TI AIUTA A:)"
        className="w-32 flex-shrink-0 font-semibold"
      />
      
      <Input
        value={claim.content}
        onChange={(e) => onUpdate(claim.id, "content", e.target.value)}
        placeholder="Contenuto del claim..."
        className="flex-1"
      />
      
      {canDelete && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(claim.id)}
          className="text-destructive hover:text-destructive flex-shrink-0"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
