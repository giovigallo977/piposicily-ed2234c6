import { useState } from "react";
import { useFreeSpots, useCreateFreeSpot, useUpdateFreeSpot, useDeleteFreeSpot, FreeSpot, FreeSpotInsert } from "@/hooks/useFreeSpots";
import { useFreeSpotCategories, useUpdateFreeSpotCategory } from "@/hooks/useFreeSpotCategories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ImageUpload, MultiImageUpload } from "@/components/ImageUpload";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

const FREE_SPOT_CATEGORIES = ["Lavorare", "Studiare", "Eat & Drink"];

const emptySpot: FreeSpotInsert = {
  titolo: "",
  descrizione_breve: "",
  descrizione_completa: "",
  foto_principale: "",
  foto_gallery: [],
  link_google_maps: "",
  categoria: "",
  zona: "",
  tags: [],
  ordine: 0,
};

const AdminFreeSpotsTab = () => {
  const { data: categories } = useFreeSpotCategories();
  const updateCategoryMutation = useUpdateFreeSpotCategory();
  const { data: spots, isLoading } = useFreeSpots();
  const createMutation = useCreateFreeSpot();
  const updateMutation = useUpdateFreeSpot();
  const deleteMutation = useDeleteFreeSpot();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSpot, setEditingSpot] = useState<FreeSpot | null>(null);
  const [formData, setFormData] = useState<FreeSpotInsert>(emptySpot);
  const [tagInput, setTagInput] = useState("");

  const handleOpenCreate = () => {
    setEditingSpot(null);
    setFormData({ ...emptySpot, ordine: (spots?.length ?? 0) + 1 });
    setTagInput("");
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (spot: FreeSpot) => {
    setEditingSpot(spot);
    setFormData({
      titolo: spot.titolo,
      descrizione_breve: spot.descrizione_breve,
      descrizione_completa: spot.descrizione_completa,
      foto_principale: spot.foto_principale,
      foto_gallery: spot.foto_gallery || [],
      link_google_maps: spot.link_google_maps,
      categoria: spot.categoria,
      zona: spot.zona || "",
      tags: spot.tags || [],
      ordine: spot.ordine,
    });
    setTagInput((spot.tags || []).join(", "));
    setIsDialogOpen(true);
  };

  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setEditingSpot(null);
      setFormData({ ...emptySpot });
      setTagInput("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSave = {
      ...formData,
      tags: tagInput.split(",").map((t) => t.trim()).filter(Boolean),
    };
    if (editingSpot) {
      await updateMutation.mutateAsync({ id: editingSpot.id, updates: dataToSave });
    } else {
      await createMutation.mutateAsync(dataToSave);
    }
    setIsDialogOpen(false);
    setEditingSpot(null);
    setFormData({ ...emptySpot });
    setTagInput("");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Categorie con immagini */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Immagini Categorie</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            {categories?.map((cat) => (
              <div key={cat.id} className="space-y-2">
                <Label className="font-semibold">{cat.nome}</Label>
                <ImageUpload
                  value={cat.immagine || ""}
                  onChange={(url) => updateCategoryMutation.mutate({ id: cat.id, immagine: url })}
                  bucket="hotspot-images"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-bold">Gestione Free Spots</h2>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Nuovo Free Spot
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingSpot ? "Modifica Free Spot" : "Nuovo Free Spot"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fs-titolo">Titolo *</Label>
                  <Input
                    id="fs-titolo"
                    value={formData.titolo}
                    onChange={(e) => setFormData({ ...formData, titolo: e.target.value })}
                    placeholder="Nome del locale"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fs-categoria">Categoria</Label>
                  <Select
                    value={formData.categoria || ""}
                    onValueChange={(value) => setFormData({ ...formData, categoria: value })}
                  >
                    <SelectTrigger id="fs-categoria">
                      <SelectValue placeholder="Seleziona..." />
                    </SelectTrigger>
                    <SelectContent>
                      {FREE_SPOT_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fs-zona">Zona</Label>
                  <Input
                    id="fs-zona"
                    value={formData.zona || ""}
                    onChange={(e) => setFormData({ ...formData, zona: e.target.value })}
                    placeholder="Es: Centro, Lungomare..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fs-ordine">Ordine</Label>
                  <Input
                    id="fs-ordine"
                    type="number"
                    value={formData.ordine ?? 0}
                    onChange={(e) => setFormData({ ...formData, ordine: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fs-desc-breve">Descrizione Breve *</Label>
                <Input
                  id="fs-desc-breve"
                  value={formData.descrizione_breve}
                  onChange={(e) => setFormData({ ...formData, descrizione_breve: e.target.value })}
                  placeholder="Una frase breve"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fs-desc-completa">Descrizione Completa</Label>
                <Textarea
                  id="fs-desc-completa"
                  value={formData.descrizione_completa}
                  onChange={(e) => setFormData({ ...formData, descrizione_completa: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Foto Principale</Label>
                <ImageUpload
                  value={formData.foto_principale || ""}
                  onChange={(url) => setFormData({ ...formData, foto_principale: url })}
                  bucket="hotspot-images"
                />
              </div>

              <div className="space-y-2">
                <Label>Galleria Foto</Label>
                <MultiImageUpload
                  values={formData.foto_gallery || []}
                  onChange={(urls) => setFormData({ ...formData, foto_gallery: urls })}
                  bucket="hotspot-images"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fs-maps">Link Google Maps</Label>
                <Input
                  id="fs-maps"
                  value={formData.link_google_maps || ""}
                  onChange={(e) => setFormData({ ...formData, link_google_maps: e.target.value })}
                  placeholder="https://maps.google.com/..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fs-tags">Tags (separati da virgola)</Label>
                <Input
                  id="fs-tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="wifi, prese, silenzioso..."
                />
              </div>

              <Button type="submit" className="w-full" disabled={createMutation.isPending || updateMutation.isPending}>
                {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {editingSpot ? "Salva Modifiche" : "Crea Free Spot"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {spots?.map((spot) => (
          <Card key={spot.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{spot.titolo}</CardTitle>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(spot)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Eliminare "{spot.titolo}"?</AlertDialogTitle>
                        <AlertDialogDescription>Questa azione non può essere annullata.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annulla</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteMutation.mutate(spot.id)}>Elimina</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {spot.categoria && <span className="px-2 py-0.5 rounded-full bg-muted text-xs font-medium">{spot.categoria}</span>}
                {spot.zona && <span>📍 {spot.zona}</span>}
              </div>
              <p className="text-sm mt-1">{spot.descrizione_breve}</p>
            </CardContent>
          </Card>
        ))}
        {spots?.length === 0 && (
          <p className="text-center py-8 text-muted-foreground italic">Nessun free spot ancora. Crea il primo!</p>
        )}
      </div>
    </div>
  );
};

export default AdminFreeSpotsTab;
