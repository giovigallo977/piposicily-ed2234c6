import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, X, ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB - compress earlier for mobile
const TARGET_SIZE = 1.5 * 1024 * 1024; // 1.5MB target - faster uploads on mobile

// Fast mobile-optimized image compression
const compressImage = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Mobile-friendly max dimension - 1600px is plenty for display
        const maxDimension = 1600;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height / width) * maxDimension);
            width = maxDimension;
          } else {
            width = Math.round((width / height) * maxDimension);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d", { alpha: true });
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        // High quality rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        // Determine output format - preserve PNG for transparency
        const isPng = file.type === "image/png";
        const outputType = isPng ? "image/png" : "image/jpeg";
        const extension = isPng ? "png" : "jpg";

        // For PNG, try to compress by reducing dimensions gradually if too large
        // For JPEG, start with good quality (0.85) - faster compression for mobile
        let quality = 0.85;
        let currentWidth = width;
        let currentHeight = height;

        const tryCompress = () => {
          // For PNG that's still too large, reduce dimensions slightly
          if (isPng && currentWidth > 1500) {
            const tempCanvas = document.createElement("canvas");
            currentWidth = Math.round(currentWidth * 0.9);
            currentHeight = Math.round(currentHeight * 0.9);
            tempCanvas.width = currentWidth;
            tempCanvas.height = currentHeight;
            const tempCtx = tempCanvas.getContext("2d", { alpha: true });
            if (tempCtx) {
              tempCtx.imageSmoothingEnabled = true;
              tempCtx.imageSmoothingQuality = "high";
              tempCtx.drawImage(canvas, 0, 0, currentWidth, currentHeight);
              
              tempCanvas.toBlob(
                (blob) => {
                  if (!blob) {
                    reject(new Error("Could not compress image"));
                    return;
                  }

                  if (blob.size > TARGET_SIZE && currentWidth > 1000) {
                    canvas.width = currentWidth;
                    canvas.height = currentHeight;
                    ctx.drawImage(tempCanvas, 0, 0);
                    tryCompress();
                    return;
                  }

                  const compressedFile = new File([blob], file.name.replace(/\.[^.]+$/, `.${extension}`), {
                    type: outputType,
                    lastModified: Date.now(),
                  });
                  resolve(compressedFile);
                },
                outputType
              );
              return;
            }
          }

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Could not compress image"));
                return;
              }

              // For JPEG: if still too large and quality can be reduced, try again
              // Go down to 0.6 for mobile - still good quality, much faster
              if (!isPng && blob.size > TARGET_SIZE && quality > 0.6) {
                quality -= 0.1; // Bigger steps for faster compression
                tryCompress();
                return;
              }

              const compressedFile = new File([blob], file.name.replace(/\.[^.]+$/, `.${extension}`), {
                type: outputType,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            },
            outputType,
            isPng ? undefined : quality
          );
        };

        tryCompress();
      };
      img.onerror = () => reject(new Error("Could not load image"));
    };
    reader.onerror = () => reject(new Error("Could not read file"));
  });
};

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
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let file = e.target.files?.[0];
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

    // Compress if file is larger than 5MB
    if (file.size > MAX_FILE_SIZE) {
      setIsCompressing(true);
      toast({
        title: "Compressione in corso",
        description: `Immagine di ${(file.size / 1024 / 1024).toFixed(1)}MB, ridimensionamento automatico...`,
      });

      try {
        file = await compressImage(file);
        toast({
          title: "Immagine compressa",
          description: `Nuova dimensione: ${(file.size / 1024 / 1024).toFixed(1)}MB`,
        });
      } catch (error) {
        console.error("Compression error:", error);
        toast({
          title: "Errore",
          description: "Impossibile comprimere l'immagine.",
          variant: "destructive",
        });
        setIsCompressing(false);
        return;
      }
      setIsCompressing(false);
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

  const isProcessing = isUploading || isCompressing;

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
          disabled={isProcessing}
          className="h-24 w-24 flex flex-col items-center justify-center gap-1"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="text-xs text-muted-foreground">
                {isCompressing ? "Compressione..." : "Caricamento..."}
              </span>
            </>
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
          disabled={isProcessing}
          className="text-xs"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin mr-1" />
              {isCompressing ? "Compressione..." : "Caricamento..."}
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
      for (let file of files) {
        if (!file.type.startsWith("image/")) continue;

        // Compress if file is larger than 5MB
        if (file.size > MAX_FILE_SIZE) {
          toast({
            title: "Compressione",
            description: `Ridimensionamento immagine ${file.name}...`,
          });
          try {
            file = await compressImage(file);
          } catch (error) {
            console.error("Compression error:", error);
            continue;
          }
        }

        const fileExt = "jpg"; // Always save as jpg after compression
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
        {values.length}/{maxImages} immagini • Immagini grandi verranno compresse automaticamente
      </p>
    </div>
  );
};
