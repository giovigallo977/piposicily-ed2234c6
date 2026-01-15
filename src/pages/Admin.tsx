import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useHotspots, useCreateHotspot, useUpdateHotspot, useDeleteHotspot, Hotspot, HotspotInsert } from "@/hooks/useHotspots";
import { useSiteContent, useUpdateSiteContent } from "@/hooks/useSiteContent";
import { useStyleSettings, useUpdateStyleSettings } from "@/hooks/useStyleSettings";
import { ImageUpload, MultiImageUpload } from "@/components/ImageUpload";
import { EmojiPicker } from "@/components/EmojiPicker";
import { SortableClaimItem, ClaimItem } from "@/components/admin/SortableClaimItem";
import { StyleEditor } from "@/components/admin/StyleEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Loader2, Plus, Pencil, Trash2, LogOut, ArrowLeft, FileText, MapPin, Palette, ChevronDown } from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { HotspotStyleOverrides, StyleSettingsUpdate } from "@/types/styles";
import pipoAlien from "@/assets/pipo-alien.png";

const emptyHotspot: HotspotInsert = {
  titolo: "",
  descrizione_breve: "",
  descrizione_completa: "",
  foto_principale: "",
  foto_gallery: [],
  link_google_maps: "",
  categoria: "",
  tags: [],
  ordine: 0,
  // Style overrides - all null by default
  style_card_bg_color: null,
  style_badge_bg_color: null,
  style_badge_text_color: null,
  style_expand_btn_color: null,
  style_cta_btn_color: null,
  style_cta_btn_text_color: null,
  style_font_color: null,
  style_title_font: null,
  style_title_font_bold: null,
  style_title_font_size: null,
  style_body_font: null,
  style_body_font_bold: null,
  style_body_font_size: null,
  style_button_font: null,
  style_button_font_bold: null,
  style_button_font_size: null,
};

const Admin = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: hotspots, isLoading } = useHotspots();
  const createMutation = useCreateHotspot();
  const updateMutation = useUpdateHotspot();
  const deleteMutation = useDeleteHotspot();
  
  // Site content
  const { data: missionContent, isLoading: missionLoading } = useSiteContent("mission");
  const { data: headerTitleContent, isLoading: headerTitleLoading } = useSiteContent("header_title");
  const { data: headerSubtitleContent, isLoading: headerSubtitleLoading } = useSiteContent("header_subtitle");
  const { data: claimsContent, isLoading: claimsLoading } = useSiteContent("claims");
  const updateSiteContent = useUpdateSiteContent();

  // Style settings
  const { data: styleSettings, isLoading: stylesLoading } = useStyleSettings();
  const updateStyleSettings = useUpdateStyleSettings();
  const [localStyleSettings, setLocalStyleSettings] = useState<StyleSettingsUpdate>({});

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHotspot, setEditingHotspot] = useState<Hotspot | null>(null);
  const [formData, setFormData] = useState<HotspotInsert>(emptyHotspot);
  const [missionText, setMissionText] = useState("");
  const [headerTitle, setHeaderTitle] = useState("");
  const [headerSubtitle, setHeaderSubtitle] = useState("");
  const [claims, setClaims] = useState<ClaimItem[]>([]);
  const [originalClaimsJson, setOriginalClaimsJson] = useState("");
  const [styleOverridesOpen, setStyleOverridesOpen] = useState(false);
  
  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (missionContent?.content) {
      setMissionText(missionContent.content);
    }
  }, [missionContent]);

  useEffect(() => {
    if (headerTitleContent?.content) {
      setHeaderTitle(headerTitleContent.content);
    }
  }, [headerTitleContent]);

  useEffect(() => {
    if (headerSubtitleContent?.content) {
      setHeaderSubtitle(headerSubtitleContent.content);
    }
  }, [headerSubtitleContent]);

  useEffect(() => {
    if (claimsContent?.content) {
      try {
        const parsed = JSON.parse(claimsContent.content);
        const claimsWithIds = parsed.map((item: { label: string; content: string }, index: number) => ({
          id: `claim-${index}`,
          label: item.label,
          content: item.content,
        }));
        setClaims(claimsWithIds);
        setOriginalClaimsJson(claimsContent.content);
      } catch (e) {
        console.error("Error parsing claims:", e);
      }
    }
  }, [claimsContent]);

  // Initialize local style settings when loaded
  useEffect(() => {
    if (styleSettings) {
      setLocalStyleSettings({
        card_bg_color: styleSettings.card_bg_color,
        badge_bg_color: styleSettings.badge_bg_color,
        badge_text_color: styleSettings.badge_text_color,
        expand_btn_color: styleSettings.expand_btn_color,
        cta_btn_color: styleSettings.cta_btn_color,
        cta_btn_text_color: styleSettings.cta_btn_text_color,
        font_color: styleSettings.font_color,
        title_font: styleSettings.title_font,
        title_font_bold: styleSettings.title_font_bold,
        title_font_size: styleSettings.title_font_size,
        body_font: styleSettings.body_font,
        body_font_bold: styleSettings.body_font_bold,
        body_font_size: styleSettings.body_font_size,
        button_font: styleSettings.button_font,
        button_font_bold: styleSettings.button_font_bold,
        button_font_size: styleSettings.button_font_size,
      });
    }
  }, [styleSettings]);

  const handleOpenCreate = () => {
    setEditingHotspot(null);
    setFormData({ ...emptyHotspot, ordine: (hotspots?.length ?? 0) + 1 });
    setStyleOverridesOpen(false);
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
      categoria: hotspot.categoria,
      tags: hotspot.tags || [],
      ordine: hotspot.ordine,
      // Style overrides
      style_card_bg_color: hotspot.style_card_bg_color,
      style_badge_bg_color: hotspot.style_badge_bg_color,
      style_badge_text_color: hotspot.style_badge_text_color,
      style_expand_btn_color: hotspot.style_expand_btn_color,
      style_cta_btn_color: hotspot.style_cta_btn_color,
      style_cta_btn_text_color: hotspot.style_cta_btn_text_color,
      style_font_color: hotspot.style_font_color,
      style_title_font: hotspot.style_title_font,
      style_title_font_bold: hotspot.style_title_font_bold,
      style_title_font_size: hotspot.style_title_font_size,
      style_body_font: hotspot.style_body_font,
      style_body_font_bold: hotspot.style_body_font_bold,
      style_body_font_size: hotspot.style_body_font_size,
      style_button_font: hotspot.style_button_font,
      style_button_font_bold: hotspot.style_button_font_bold,
      style_button_font_size: hotspot.style_button_font_size,
    });
    // Check if any style override is set
    const hasOverrides = hotspot.style_card_bg_color || hotspot.style_badge_bg_color || 
      hotspot.style_font_color || hotspot.style_title_font;
    setStyleOverridesOpen(!!hasOverrides);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingHotspot) {
      await updateMutation.mutateAsync({ id: editingHotspot.id, updates: formData });
    } else {
      await createMutation.mutateAsync(formData);
    }
    
    setIsDialogOpen(false);
  };

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleSaveMission = async () => {
    await updateSiteContent.mutateAsync({ key: "mission", content: missionText });
  };

  const handleSaveHeader = async () => {
    await updateSiteContent.mutateAsync({ key: "header_title", content: headerTitle });
    await updateSiteContent.mutateAsync({ key: "header_subtitle", content: headerSubtitle });
  };

  const handleSaveClaim = async () => {
    const claimsData = claims.map(({ label, content }) => ({ label, content }));
    await updateSiteContent.mutateAsync({ key: "claims", content: JSON.stringify(claimsData) });
  };

  const handleSaveStyles = async () => {
    await updateStyleSettings.mutateAsync(localStyleSettings);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setClaims((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleClaimUpdate = (id: string, field: "label" | "content", value: string) => {
    setClaims((items) =>
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleClaimDelete = (id: string) => {
    setClaims((items) => items.filter((item) => item.id !== id));
  };

  const handleAddClaim = () => {
    setClaims((items) => [
      ...items,
      { id: `claim-${Date.now()}`, label: "", content: "" },
    ]);
  };

  const handleHotspotStyleChange = (updates: HotspotStyleOverrides) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const currentClaimsJson = JSON.stringify(claims.map(({ label, content }) => ({ label, content })));
  const isClaimUnchanged = currentClaimsJson === originalClaimsJson;

  // Check if styles have changed
  const isStylesUnchanged = styleSettings && 
    localStyleSettings.card_bg_color === styleSettings.card_bg_color &&
    localStyleSettings.badge_bg_color === styleSettings.badge_bg_color &&
    localStyleSettings.badge_text_color === styleSettings.badge_text_color &&
    localStyleSettings.expand_btn_color === styleSettings.expand_btn_color &&
    localStyleSettings.cta_btn_color === styleSettings.cta_btn_color &&
    localStyleSettings.cta_btn_text_color === styleSettings.cta_btn_text_color &&
    localStyleSettings.font_color === styleSettings.font_color &&
    localStyleSettings.title_font === styleSettings.title_font &&
    localStyleSettings.title_font_bold === styleSettings.title_font_bold &&
    localStyleSettings.title_font_size === styleSettings.title_font_size &&
    localStyleSettings.body_font === styleSettings.body_font &&
    localStyleSettings.body_font_bold === styleSettings.body_font_bold &&
    localStyleSettings.body_font_size === styleSettings.body_font_size &&
    localStyleSettings.button_font === styleSettings.button_font &&
    localStyleSettings.button_font_bold === styleSettings.button_font_bold &&
    localStyleSettings.button_font_size === styleSettings.button_font_size;

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
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src={pipoAlien} alt="Pipo" className="h-8 w-8" />
              <h1 className="font-brand text-xl font-black italic">Pipo Admin</h1>
            </div>
            <div className="flex items-center gap-2">
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
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="hotspots" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Hotspots
              </TabsTrigger>
              <TabsTrigger value="contenuti" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Contenuti
              </TabsTrigger>
              <TabsTrigger value="stili" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Stili
              </TabsTrigger>
            </TabsList>

            {/* Tab Hotspots */}
            <TabsContent value="hotspots" className="space-y-6">
              {/* Toolbar */}
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-2xl font-bold">Gestione Hotspot</h2>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={handleOpenCreate}>
                      <Plus className="h-4 w-4 mr-2" />
                      Nuovo Hotspot
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
                            placeholder="Nome del luogo"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="categoria">Categoria</Label>
                          <Input
                            id="categoria"
                            value={formData.categoria}
                            onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                            placeholder="Es: Borgo, Spiaggia, Montagna..."
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="ordine">Ordine</Label>
                        <Input
                          id="ordine"
                          type="number"
                          value={formData.ordine}
                          onChange={(e) => setFormData({ ...formData, ordine: parseInt(e.target.value) || 0 })}
                          className="w-24"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="descrizione_breve">Descrizione Breve *</Label>
                        <div className="flex gap-2">
                          <Input
                            id="descrizione_breve"
                            value={formData.descrizione_breve}
                            onChange={(e) => setFormData({ ...formData, descrizione_breve: e.target.value })}
                            placeholder="Una frase breve (max ~60 caratteri)"
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
                            placeholder="Descrizione dettagliata del luogo..."
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

                      {/* Tag */}
                      <div className="space-y-2">
                        <Label>Tag (opzionali - max 3)</Label>
                        <div className="grid grid-cols-3 gap-2">
                          <Input
                            placeholder="Es: Silenzio"
                            value={formData.tags?.[0] || ""}
                            onChange={(e) => {
                              const newTags = [...(formData.tags || [])];
                              newTags[0] = e.target.value;
                              setFormData({ ...formData, tags: newTags });
                            }}
                          />
                          <Input
                            placeholder="Es: Camminate"
                            value={formData.tags?.[1] || ""}
                            onChange={(e) => {
                              const newTags = [...(formData.tags || [])];
                              newTags[1] = e.target.value;
                              setFormData({ ...formData, tags: newTags });
                            }}
                          />
                          <Input
                            placeholder="Es: Aria fresca"
                            value={formData.tags?.[2] || ""}
                            onChange={(e) => {
                              const newTags = [...(formData.tags || [])];
                              newTags[2] = e.target.value;
                              setFormData({ ...formData, tags: newTags });
                            }}
                          />
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

                      {/* Style Overrides Section */}
                      <Collapsible open={styleOverridesOpen} onOpenChange={setStyleOverridesOpen}>
                        <CollapsibleTrigger asChild>
                          <Button type="button" variant="outline" className="w-full justify-between">
                            <span className="flex items-center gap-2">
                              <Palette className="h-4 w-4" />
                              Stile Personalizzato (opzionale)
                            </span>
                            <ChevronDown className={`h-4 w-4 transition-transform ${styleOverridesOpen ? 'rotate-180' : ''}`} />
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pt-4">
                          <div className="p-4 border rounded-lg bg-muted/30 space-y-4">
                            <p className="text-xs text-muted-foreground">
                              Lascia vuoti i campi per usare gli stili globali. Compila solo quelli che vuoi personalizzare per questa scheda.
                            </p>
                            <StyleEditor
                              mode="hotspot"
                              hotspotStyles={formData}
                              onHotspotChange={handleHotspotStyleChange}
                              compact
                            />
                          </div>
                        </CollapsibleContent>
                      </Collapsible>

                      <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Annulla
                        </Button>
                        <Button 
                          type="submit" 
                          disabled={createMutation.isPending || updateMutation.isPending}
                        >
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

              {/* Hotspots List */}
              <div className="space-y-4">
                {hotspots?.map((hotspot) => (
                  <Card key={hotspot.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="font-heading text-lg">{hotspot.titolo}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">{hotspot.descrizione_breve}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {hotspot.categoria && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                              {hotspot.categoria}
                            </span>
                          )}
                          {(hotspot.style_card_bg_color || hotspot.style_font_color) && (
                            <span className="text-xs bg-lavender-vivid/20 text-lavender-vivid px-2 py-1 rounded-full">
                              🎨 Custom
                            </span>
                          )}
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                            #{hotspot.ordine}
                          </span>
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
                                <AlertDialogTitle>Eliminare "{hotspot.titolo}"?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Questa azione non può essere annullata.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annulla</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDelete(hotspot.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Elimina
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 text-xs items-center">
                        {hotspot.foto_principale && (
                          <img 
                            src={hotspot.foto_principale} 
                            alt={hotspot.titolo}
                            className="h-12 w-12 object-cover rounded"
                          />
                        )}
                        {(hotspot.foto_gallery?.filter(Boolean).length || 0) > 0 && (
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            🖼️ {hotspot.foto_gallery?.filter(Boolean).length} foto gallery
                          </span>
                        )}
                        {hotspot.link_google_maps && (
                          <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded">
                            📍 Maps
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {hotspots?.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>Nessun hotspot presente.</p>
                    <p className="text-sm mt-1">Clicca "Nuovo Hotspot" per iniziare.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Tab Stili Globali */}
            <TabsContent value="stili" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-2xl font-bold">Stili Globali</h2>
                <Button 
                  onClick={handleSaveStyles}
                  disabled={updateStyleSettings.isPending || isStylesUnchanged}
                >
                  {updateStyleSettings.isPending && (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  )}
                  Salva Stili
                </Button>
              </div>
              
              <p className="text-muted-foreground text-sm">
                Questi stili vengono applicati a tutte le schede hotspot. Puoi sovrascrivere singoli valori per ogni scheda nel suo dialog di modifica.
              </p>

              {stylesLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <StyleEditor
                  mode="global"
                  globalStyles={styleSettings}
                  onGlobalChange={(updates) => setLocalStyleSettings((prev) => ({ ...prev, ...updates }))}
                />
              )}
            </TabsContent>

            {/* Tab Contenuti */}
            <TabsContent value="contenuti" className="space-y-6">
              <h2 className="font-heading text-2xl font-bold">Gestione Contenuti</h2>
              
              {/* Header Content */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Intestazione Homepage
                  </CardTitle>
                  <CardDescription>
                    Titolo e sottotitolo mostrati sotto il logo Pipo nella home page.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(headerTitleLoading || headerSubtitleLoading) ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="header_title">Titolo Header</Label>
                        <div className="flex gap-2">
                          <Input
                            id="header_title"
                            value={headerTitle}
                            onChange={(e) => setHeaderTitle(e.target.value)}
                            placeholder="Es: Scopri la Sicilia autentica"
                            className="flex-1"
                          />
                          <EmojiPicker onSelect={(emoji) => setHeaderTitle(headerTitle + emoji)} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="header_subtitle">Sottotitolo Header</Label>
                        <div className="flex gap-2">
                          <Input
                            id="header_subtitle"
                            value={headerSubtitle}
                            onChange={(e) => setHeaderSubtitle(e.target.value)}
                            placeholder="Es: I luoghi più belli selezionati per te"
                            className="flex-1"
                          />
                          <EmojiPicker onSelect={(emoji) => setHeaderSubtitle(headerSubtitle + emoji)} />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button 
                          onClick={handleSaveHeader}
                          disabled={updateSiteContent.isPending || (headerTitle === headerTitleContent?.content && headerSubtitle === headerSubtitleContent?.content)}
                        >
                          {updateSiteContent.isPending && (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          )}
                          Salva Intestazione
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Claim Content */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Claim Homepage
                  </CardTitle>
                  <CardDescription>
                    Le frasi del claim mostrate sotto il logo. Trascina per riordinare.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {claimsLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <>
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                      >
                        <SortableContext
                          items={claims.map((c) => c.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          <div className="space-y-2">
                            {claims.map((claim) => (
                              <SortableClaimItem
                                key={claim.id}
                                claim={claim}
                                onUpdate={handleClaimUpdate}
                                onDelete={handleClaimDelete}
                                canDelete={claims.length > 1}
                              />
                            ))}
                          </div>
                        </SortableContext>
                      </DndContext>
                      
                      <div className="flex justify-between pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleAddClaim}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Aggiungi riga
                        </Button>
                        <Button 
                          onClick={handleSaveClaim}
                          disabled={updateSiteContent.isPending || isClaimUnchanged}
                        >
                          {updateSiteContent.isPending && (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          )}
                          Salva Claim
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Mission Content */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    La missione di Pipo
                  </CardTitle>
                  <CardDescription>
                    Questo testo viene mostrato nella pagina "La missione di Pipo" accessibile dal menu.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {missionLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-2 items-start">
                        <Textarea
                          value={missionText}
                          onChange={(e) => setMissionText(e.target.value)}
                          placeholder="Scrivi qui il testo della missione di Pipo..."
                          rows={8}
                          className="resize-y flex-1"
                        />
                        <EmojiPicker onSelect={(emoji) => setMissionText(missionText + emoji)} />
                      </div>
                      <div className="flex justify-end">
                        <Button 
                          onClick={handleSaveMission}
                          disabled={updateSiteContent.isPending || missionText === missionContent?.content}
                        >
                          {updateSiteContent.isPending && (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          )}
                          Salva Missione
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Admin;
