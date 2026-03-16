import { useState, useEffect } from "react";
import {
  useCollections,
  useCreateCollection,
  useUpdateCollection,
  useDeleteCollection,
  useCollectionHotspots,
  useSyncCollectionHotspots,
  useReorderCollectionHotspots,
  useCollectionsRealtime,
  Collection,
  CollectionInsert,
  CollectionHotspot,
} from "@/hooks/useCollections";
import { useHotspots } from "@/hooks/useHotspots";
import { ImageUpload } from "@/components/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Loader2, Plus, Pencil, Trash2, ArrowUp, ArrowDown } from "lucide-react";

const emptyCollection: CollectionInsert = {
  nome: "",
  descrizione: "",
  immagine: "",
  ordine: 0,
};

const AdminCollectionsTab = () => {
  // Enable realtime sync
  useCollectionsRealtime();

  const { data: collections, isLoading } = useCollections();
  const { data: hotspots } = useHotspots();
  const createMutation = useCreateCollection();
  const updateMutation = useUpdateCollection();
  const deleteMutation = useDeleteCollection();
  const syncHotspots = useSyncCollectionHotspots();
  const reorderMutation = useReorderCollectionHotspots();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Collection | null>(null);
  const [formData, setFormData] = useState<CollectionInsert>(emptyCollection);
  const [selectedHotspotIds, setSelectedHotspotIds] = useState<string[]>([]);

  // Load hotspot associations when editing
  const { data: currentHotspots } = useCollectionHotspots(editing?.id);

  useEffect(() => {
    if (currentHotspots) {
      setSelectedHotspotIds(currentHotspots.map(ch => ch.hotspot_id));
    }
  }, [currentHotspots]);

  const handleOpenCreate = () => {
    setEditing(null);
    setFormData({ ...emptyCollection, ordine: (collections?.length ?? 0) + 1 });
    setSelectedHotspotIds([]);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (collection: Collection) => {
    setEditing(collection);
    setFormData({
      nome: collection.nome,
      descrizione: collection.descrizione,
      immagine: collection.immagine,
      ordine: collection.ordine,
    });
    setIsDialogOpen(true);
  };

  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setEditing(null);
      setFormData({ ...emptyCollection });
      setSelectedHotspotIds([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let collectionId: string;

    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, updates: formData });
      collectionId = editing.id;
    } else {
      const result = await createMutation.mutateAsync(formData);
      collectionId = result.id;
    }

    await syncHotspots.mutateAsync({ collectionId, hotspotIds: selectedHotspotIds });
    setIsDialogOpen(false);
    setEditing(null);
    setFormData({ ...emptyCollection });
    setSelectedHotspotIds([]);
  };

  const toggleHotspot = (hotspotId: string) => {
    setSelectedHotspotIds(prev =>
      prev.includes(hotspotId)
        ? prev.filter(id => id !== hotspotId)
        : [...prev, hotspotId]
    );
  };

  // Reorder handler for collection hotspots (swap two items)
  const handleReorderSwap = (items: CollectionHotspot[], idx: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= items.length) return;
    const a = items[idx];
    const b = items[targetIdx];
    reorderMutation.mutate([
      { id: a.id, ordine: b.ordine ?? 0 },
      { id: b.id, ordine: a.ordine ?? 0 },
    ]);
  };

  // Get sorted hotspot details for the current collection
  const sortedCollectionHotspots = currentHotspots
    ? [...currentHotspots].sort((a, b) => (a.ordine ?? 0) - (b.ordine ?? 0))
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-bold">Gestione Collezioni</h2>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Nuova Collezione
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "Modifica Collezione" : "Nuova Collezione"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="coll_nome">Nome *</Label>
                  <Input
                    id="coll_nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Nome della collezione"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="coll_ordine">Ordine</Label>
                  <Input
                    id="coll_ordine"
                    type="number"
                    value={formData.ordine}
                    onChange={(e) => setFormData({ ...formData, ordine: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="coll_desc">Descrizione</Label>
                <Textarea
                  id="coll_desc"
                  value={formData.descrizione}
                  onChange={(e) => setFormData({ ...formData, descrizione: e.target.value })}
                  placeholder="Descrizione opzionale..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Immagine Copertina</Label>
                <ImageUpload
                  value={formData.immagine}
                  onChange={(url) => setFormData({ ...formData, immagine: url })}
                  onRemove={() => setFormData({ ...formData, immagine: "" })}
                  folder="collections"
                />
              </div>

              {/* Hotspot selection */}
              <div className="space-y-2">
                <Label>Hotspot nella collezione</Label>
                <div className="max-h-60 overflow-y-auto border rounded-md p-3 space-y-2">
                  {hotspots?.map((h) => (
                    <label key={h.id} className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 rounded p-1.5">
                      <Checkbox
                        checked={selectedHotspotIds.includes(h.id)}
                        onCheckedChange={() => toggleHotspot(h.id)}
                      />
                      <div className="flex items-center gap-2 min-w-0">
                        {h.foto_principale && (
                          <img src={h.foto_principale} alt="" className="w-8 h-8 rounded object-cover flex-shrink-0" />
                        )}
                        <span className="text-sm truncate">{h.titolo}</span>
                      </div>
                    </label>
                  ))}
                  {(!hotspots || hotspots.length === 0) && (
                    <p className="text-sm text-muted-foreground">Nessun hotspot disponibile.</p>
                  )}
                </div>
              </div>

              {/* Reorder hotspots in collection (only when editing) */}
              {editing && sortedCollectionHotspots.length > 0 && (
                <div className="space-y-2">
                  <Label>Ordina hotspot nella collezione (frecce = salvataggio immediato)</Label>
                  <div className="border rounded-md p-3 space-y-1">
                    {sortedCollectionHotspots.map((ch, idx) => {
                      const hotspot = hotspots?.find(h => h.id === ch.hotspot_id);
                      if (!hotspot) return null;
                      return (
                        <div key={ch.id} className="flex items-center gap-3 p-1.5 rounded hover:bg-muted/50">
                          <div className="flex flex-col gap-0.5 flex-shrink-0">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              disabled={idx === 0 || reorderMutation.isPending}
                              onClick={() => handleReorderSwap(sortedCollectionHotspots, idx, "up")}
                            >
                              <ArrowUp className="h-3 w-3" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              disabled={idx === sortedCollectionHotspots.length - 1 || reorderMutation.isPending}
                              onClick={() => handleReorderSwap(sortedCollectionHotspots, idx, "down")}
                            >
                              <ArrowDown className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-2 min-w-0">
                            {hotspot.foto_principale && (
                              <img src={hotspot.foto_principale} alt="" className="w-8 h-8 rounded object-cover flex-shrink-0" />
                            )}
                            <span className="text-sm truncate">{hotspot.titolo}</span>
                            <span className="text-xs text-muted-foreground ml-auto flex-shrink-0">#{ch.ordine}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annulla
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending || syncHotspots.isPending}
                >
                  {(createMutation.isPending || updateMutation.isPending || syncHotspots.isPending) && (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  )}
                  {editing ? "Salva Modifiche" : "Crea Collezione"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Collections list */}
      <div className="space-y-4">
        {isLoading && (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        {collections && collections.length > 0 ? (
          collections.map((collection) => (
            <Card key={collection.id} className="overflow-hidden">
              <div className="flex items-start gap-4 p-4">
                {collection.immagine && (
                  <div className="flex-shrink-0">
                    <img
                      src={collection.immagine}
                      alt={collection.nome}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-lg truncate">{collection.nome}</h3>
                      {collection.descrizione && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{collection.descrizione}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(collection)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Eliminare questa collezione?</AlertDialogTitle>
                            <AlertDialogDescription>
                              La collezione "{collection.nome}" sarà eliminata definitivamente.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annulla</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteMutation.mutate(collection.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Elimina
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : !isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>Nessuna collezione presente.</p>
            <p className="text-sm mt-1">Clicca "Nuova Collezione" per iniziare.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default AdminCollectionsTab;
