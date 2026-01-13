import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, X, ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  bucket?: string;
  folder?: string;
  className?: string;
}

export const ImageUpload = ({
  value,
  onChange,
  onRemove,
  bucket = "hotspot-images",
  folder = "uploads",
  className = "",
}: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Errore",
        description: "Il file deve essere un'immagine.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Errore",
        description: "L'immagine non può superare i 5MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Generate unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      onChange(urlData.publicUrl);
      
      toast({
        title: "Immagine caricata",
        description: "L'immagine è stata caricata con successo.",
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Errore",
        description: "Impossibile caricare l'immagine.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />

      {value ? (
        <div className="relative inline-block">
          <img
            src={value}
            alt="Preview"
            className="h-24 w-24 object-cover rounded-lg border border-border"
          />
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="h-24 w-24 flex flex-col items-center justify-center gap-1"
        >
          {isUploading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <>
              <ImageIcon className="h-6 w-6 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Carica</span>
            </>
          )}
        </Button>
      )}

      {!value && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="text-xs"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin mr-1" />
              Caricamento...
            </>
          ) : (
            <>
              <Upload className="h-3 w-3 mr-1" />
              Seleziona immagine
            </>
          )}
        </Button>
      )}
    </div>
  );
};

interface MultiImageUploadProps {
  values: string[];
  onChange: (urls: string[]) => void;
  bucket?: string;
  folder?: string;
  maxImages?: number;
}

export const MultiImageUpload = ({
  values,
  onChange,
  bucket = "hotspot-images",
  folder = "gallery",
  maxImages = 10,
}: MultiImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (values.length + files.length > maxImages) {
      toast({
        title: "Errore",
        description: `Puoi caricare massimo ${maxImages} immagini.`,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of files) {
        if (!file.type.startsWith("image/")) continue;
        if (file.size > 5 * 1024 * 1024) continue;

        const fileExt = file.name.split(".").pop();
        const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(fileName);

        uploadedUrls.push(urlData.publicUrl);
      }

      onChange([...values, ...uploadedUrls]);
      
      toast({
        title: "Immagini caricate",
        description: `${uploadedUrls.length} immagine/i caricata/e con successo.`,
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Errore",
        description: "Impossibile caricare alcune immagini.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleUpload}
        className="hidden"
      />

      <div className="flex flex-wrap gap-2">
        {values.map((url, index) => (
          <div key={index} className="relative">
            <img
              src={url}
              alt={`Gallery ${index + 1}`}
              className="h-20 w-20 object-cover rounded-lg border border-border"
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        {values.length < maxImages && (
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="h-20 w-20 flex flex-col items-center justify-center gap-1"
          >
            {isUploading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Upload className="h-5 w-5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Aggiungi</span>
              </>
            )}
          </Button>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        {values.length}/{maxImages} immagini • Max 5MB per immagine
      </p>
    </div>
  );
};
