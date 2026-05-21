import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useHotspots, useCreateHotspot, useUpdateHotspot, useDeleteHotspot, useReorderHotspots, Hotspot, HotspotInsert } from "@/hooks/useHotspots";
import { useSiteContent, useUpdateSiteContent } from "@/hooks/useSiteContent";
import { ImageUpload, MultiImageUpload } from "@/components/ImageUpload";
import { EmojiPicker } from "@/components/EmojiPicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Plus, Pencil, Trash2, LogOut, ArrowLeft, FileText, MapPin, ArrowUp, ArrowDown, BarChart3, Mail, User } from "lucide-react";
import pipoAlien from "@/assets/pipo-alien-new.png";
import AdminUsersTab from "@/components/AdminUsersTab";

const CATEGORIES = [
  "Luoghi Fantasma",
  "Natura",
  "Borghi",
  "Arte e Cultura",
  "Work Study Eat&Drink",
];

const emptyHotspot: HotspotInsert = {
  titolo: "",
  descrizione_breve: "",
  descrizione_completa: "",
  foto_principale: "",
  foto_gallery: [],
  link_google_maps: "",
  link_prenotazione: "",
  categoria: "",
  zona: "",
  tags: [],
  ordine: 0,
};

// Helper: editable site_content field
const ContentField = ({
  contentKey,
  label,
  multiline = false,
  rows = 4,
  placeholder = "",
}: {
  contentKey: string;
  label: string;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
}) => {
  const { data, isLoading } = useSiteContent(contentKey);
  const update = useUpdateSiteContent();
  const [value, setValue] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded && data !== undefined) {
      setValue(data?.content || "");
      setLoaded(true);
    }
  }, [data, loaded]);

  const dirty = loaded && value !== (data?.content || "");

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {multiline ? (
        <div className="flex gap-2 items-start">
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows={rows}
            placeholder={placeholder}
            className="flex-1"
            disabled={isLoading}
          />
          <EmojiPicker onSelect={(emoji) => setValue(value + emoji)} />
        </div>
      ) : (
        <div className="flex gap-2">
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            className="flex-1"
            disabled={isLoading}
          />
          <EmojiPicker onSelect={(emoji) => setValue(value + emoji)} />
        </div>
      )}
      <div className="flex justify-end">
        <Button
          size="sm"
          onClick={() => update.mutate({ key: contentKey, content: value })}
          disabled={!dirty || update.isPending}
        >
          {update.isPending && <Loader2 className="h-3 w-3 animate-spin mr-2" />}
          Salva
        </Button>
      </div>
    </div>
  );
};

const Admin = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: hotspots, isLoading } = useHotspots();
  const createMutation = useCreateHotspot();
  const updateMutation = useUpdateHotspot();
  const deleteMutation = useDeleteHotspot();
  const reorderMutation = useReorderHotspots();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHotspot, setEditingHotspot] = useState<Hotspot | null>(null);
  const [formData, setFormData] = useState<HotspotInsert>(emptyHotspot);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  const handleOpenCreate = () => {
    setEditingHotspot(null);
    setFormData({ ...emptyHotspot, ordine: (hotspots?.length ?? 0) + 1 });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (hotspot: Hotspot) => {
    setEditingHotspot(hotspot);
    setFormData({
      titolo: hotspot.titolo,
      descrizione_breve: hotspot.descrizione_breve,
      descrizione_completa: hotspot.descrizione_completa,
      foto_principale: hotspot.foto_principale,
      foto_gallery: hotspot.foto_gallery || [],
      link_google_maps: hotspot.link_google_maps,
      link_prenotazione: hotspot.link_prenotazione || "",
      categoria: hotspot.categoria,
      zona: hotspot.zona || "",
      tags: hotspot.tags || [],
      ordine: hotspot.ordine,
    });
    setIsDialogOpen(true);
  };

  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setEditingHotspot(null);
      setFormData({ ...emptyHotspot });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingHotspot) {
      await updateMutation.mutateAsync({ id: editingHotspot.id, updates: formData });
    } else {
      await createMutation.mutateAsync(formData);
    }
    setEditingHotspot(null);
    setFormData({ ...emptyHotspot });
    setIsDialogOpen(false);
  };

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src={pipoAlien} alt="Pipo" className="h-8 w-8" />
              <h1 className="font-brand text-xl font-black italic">Pipo Admin</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate("/admin-analytics")}>
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Vedi Sito
              </Button>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Esci
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="hotspots" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="hotspots" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Hotspots
              </TabsTrigger>
              <TabsTrigger value="about" className="flex items-center gap-2">
                <User className="h-4 w-4" /> About Pipo
              </TabsTrigger>
              <TabsTrigger value="contatti" className="flex items-center gap-2">
                <FileText className="h-4 w-4" /> Contatti
              </TabsTrigger>
              <TabsTrigger value="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> Email
              </TabsTrigger>
            </TabsList>

            {/* Tab Hotspots */}
            <TabsContent value="hotspots" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-2xl font-bold">Gestione Hotspot</h2>
                <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
                  <DialogTrigger asChild>
                    <Button onClick={handleOpenCreate}>
                      <Plus className="h-4 w-4 mr-2" /> Nuovo Hotspot
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingHotspot ? "Modifica Hotspot" : "Nuovo Hotspot"}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="titolo">Titolo *</Label>
                          <Input
                            id="titolo"
                            value={formData.titolo}
                            onChange={(e) => setFormData({ ...formData, titolo: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="categoria">Categoria *</Label>
                          <Select
                            value={formData.categoria || ""}
                            onValueChange={(value) => setFormData({ ...formData, categoria: value })}
                          >
                            <SelectTrigger id="categoria">
                              <SelectValue placeholder="Seleziona categoria..." />
                            </SelectTrigger>
                            <SelectContent>
                              {CATEGORIES.map((c) => (
                                <SelectItem key={c} value={c}>{c}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="zona">Zona</Label>
                          <Input
                            id="zona"
                            value={formData.zona || ""}
                            onChange={(e) => setFormData({ ...formData, zona: e.target.value })}
                            placeholder="Es: Messina, Palermo..."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="ordine">Ordine</Label>
                          <Input
                            id="ordine"
                            type="number"
                            value={formData.ordine}
                            onChange={(e) => setFormData({ ...formData, ordine: parseInt(e.target.value) || 0 })}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="descrizione_breve">Descrizione Breve *</Label>
                        <div className="flex gap-2">
                          <Input
                            id="descrizione_breve"
                            value={formData.descrizione_breve}
                            onChange={(e) => setFormData({ ...formData, descrizione_breve: e.target.value })}
                            required
                            className="flex-1"
                          />
                          <EmojiPicker onSelect={(emoji) => setFormData({ ...formData, descrizione_breve: formData.descrizione_breve + emoji })} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="descrizione_completa">Descrizione Completa *</Label>
                        <div className="flex gap-2 items-start">
                          <Textarea
                            id="descrizione_completa"
                            value={formData.descrizione_completa}
                            onChange={(e) => setFormData({ ...formData, descrizione_completa: e.target.value })}
                            rows={4}
                            required
                            className="flex-1"
                          />
                          <EmojiPicker onSelect={(emoji) => setFormData({ ...formData, descrizione_completa: formData.descrizione_completa + emoji })} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Foto Principale</Label>
                        <ImageUpload
                          value={formData.foto_principale || ""}
                          onChange={(url) => setFormData({ ...formData, foto_principale: url })}
                          onRemove={() => setFormData({ ...formData, foto_principale: "" })}
                          folder="main"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Gallery</Label>
                        <MultiImageUpload
                          values={formData.foto_gallery?.filter(Boolean) || []}
                          onChange={(urls) => setFormData({ ...formData, foto_gallery: urls })}
                          folder="gallery"
                          maxImages={10}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Tag (max 3)</Label>
                        <div className="grid grid-cols-3 gap-2">
                          {[0, 1, 2].map((i) => (
                            <Input
                              key={i}
                              placeholder={`Tag ${i + 1}`}
                              value={formData.tags?.[i] || ""}
                              onChange={(e) => {
                                const newTags = [...(formData.tags || [])];
                                newTags[i] = e.target.value;
                                setFormData({ ...formData, tags: newTags });
                              }}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="link_google_maps">Link Google Maps</Label>
                        <Input
                          id="link_google_maps"
                          value={formData.link_google_maps}
                          onChange={(e) => setFormData({ ...formData, link_google_maps: e.target.value })}
                          placeholder="https://maps.google.com/?q=..."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="link_prenotazione">Link Prenotazione</Label>
                        <Input
                          id="link_prenotazione"
                          value={formData.link_prenotazione || ""}
                          onChange={(e) => setFormData({ ...formData, link_prenotazione: e.target.value })}
                          placeholder="https://..."
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Annulla
                        </Button>
                        <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                          {(createMutation.isPending || updateMutation.isPending) && (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          )}
                          {editingHotspot ? "Salva Modifiche" : "Crea Hotspot"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Hotspots list grouped by category */}
              <div className="space-y-6">
                {hotspots && hotspots.length > 0 ? (
                  (() => {
                    const grouped = hotspots.reduce<Record<string, Hotspot[]>>((acc, h) => {
                      const cat = h.categoria || "Senza Categoria";
                      if (!acc[cat]) acc[cat] = [];
                      acc[cat].push(h);
                      return acc;
                    }, {});
                    Object.values(grouped).forEach((arr) => arr.sort((a, b) => (a.ordine ?? 999) - (b.ordine ?? 999)));

                    const handleSwap = (catItems: Hotspot[], idx: number, direction: "up" | "down") => {
                      const targetIdx = direction === "up" ? idx - 1 : idx + 1;
                      if (targetIdx < 0 || targetIdx >= catItems.length) return;
                      const a = catItems[idx];
                      const b = catItems[targetIdx];
                      reorderMutation.mutate([
                        { id: a.id, ordine: b.ordine ?? 0 },
                        { id: b.id, ordine: a.ordine ?? 0 },
                      ]);
                    };

                    return Object.entries(grouped).map(([categoria, items]) => (
                      <div key={categoria}>
                        <h3 className="font-heading text-lg font-bold mb-3 flex items-center gap-2">
                          {categoria}
                          <span className="text-xs font-normal text-muted-foreground">({items.length})</span>
                        </h3>
                        <div className="space-y-2">
                          {items.map((hotspot, idx) => (
                            <Card key={hotspot.id} className="overflow-hidden">
                              <div className="flex items-start gap-4 p-4">
                                <div className="flex flex-col gap-1 flex-shrink-0 pt-1">
                                  <Button variant="ghost" size="icon" className="h-6 w-6"
                                    disabled={idx === 0 || reorderMutation.isPending}
                                    onClick={() => handleSwap(items, idx, "up")}>
                                    <ArrowUp className="h-3 w-3" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-6 w-6"
                                    disabled={idx === items.length - 1 || reorderMutation.isPending}
                                    onClick={() => handleSwap(items, idx, "down")}>
                                    <ArrowDown className="h-3 w-3" />
                                  </Button>
                                </div>
                                {hotspot.foto_principale && (
                                  <img src={hotspot.foto_principale} alt={hotspot.titolo}
                                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0" />
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2">
                                    <div>
                                      <h3 className="font-semibold text-lg truncate">{hotspot.titolo}</h3>
                                      <div className="flex flex-wrap gap-2 mt-1">
                                        {hotspot.zona && (
                                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-olive/20 text-olive">
                                            📍 {hotspot.zona}
                                          </span>
                                        )}
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground">
                                          ordine: {hotspot.ordine ?? 0}
                                        </span>
                                      </div>
                                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                        {hotspot.descrizione_breve}
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-1 flex-shrink-0">
                                      <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(hotspot)}>
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
                                            <AlertDialogTitle>Eliminare questo hotspot?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                              L'hotspot "{hotspot.titolo}" sarà eliminato definitivamente.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>Annulla</AlertDialogCancel>
                                            <AlertDialogAction
                                              onClick={() => handleDelete(hotspot.id)}
                                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
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
                          ))}
                        </div>
                      </div>
                    ));
                  })()
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>Nessun hotspot presente.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Tab About Pipo */}
            <TabsContent value="about" className="space-y-6">
              <h2 className="font-heading text-2xl font-bold">Pagina About Pipo</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Sezione 1</CardTitle>
                  <CardDescription>Titolo e testo della prima sezione.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ContentField contentKey="about_chi_title" label="Titolo" placeholder="Es: CHI È PIPO" />
                  <ContentField contentKey="about_chi_body" label="Testo" multiline rows={6} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Sezione 2</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ContentField contentKey="about_perchi_title" label="Titolo" placeholder="Es: PER CHI È" />
                  <ContentField contentKey="about_perchi_body" label="Testo" multiline rows={6} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Sezione 3</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ContentField contentKey="about_alieno_title" label="Titolo" placeholder='Es: PERCHÈ "ALIENO"' />
                  <ContentField contentKey="about_alieno_body" label="Testo" multiline rows={6} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Sezione 4</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ContentField contentKey="about_principio_title" label="Titolo" placeholder="Es: IL PRINCIPIO" />
                  <ContentField contentKey="about_principio_body" label="Testo" multiline rows={6} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab Contatti */}
            <TabsContent value="contatti" className="space-y-6">
              <h2 className="font-heading text-2xl font-bold">Pagina Contatti</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Testo libero</CardTitle>
                  <CardDescription>Mostrato sopra i link di contatto. Lascia vuoto per non mostrarlo.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ContentField contentKey="contacts_body" label="Testo introduttivo" multiline rows={6} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Instagram</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ContentField contentKey="contacts_ig_label" label="Etichetta link" placeholder="IG: pipo.fuoriradar" />
                  <ContentField contentKey="contacts_ig_url" label="URL" placeholder="https://instagram.com/pipo.fuoriradar" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Email</CardTitle>
                </CardHeader>
                <CardContent>
                  <ContentField contentKey="contacts_email" label="Indirizzo email" placeholder="pipoesplora@gmail.com" />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab Email */}
            <TabsContent value="email">
              <AdminUsersTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Admin;
