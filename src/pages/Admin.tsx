import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useHotspots, useCreateHotspot, useUpdateHotspot, useDeleteHotspot, Hotspot, HotspotInsert } from "@/hooks/useHotspots";
import { useSiteContent, useUpdateSiteContent } from "@/hooks/useSiteContent";
import { ImageUpload, MultiImageUpload } from "@/components/ImageUpload";
import { EmojiPicker } from "@/components/EmojiPicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Plus, Pencil, Trash2, LogOut, ArrowLeft, FileText, MapPin } from "lucide-react";
import pipoAlien from "@/assets/pipo-alien-new.png";

const emptyHotspot: HotspotInsert = {
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

const Admin = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: hotspots, isLoading } = useHotspots();
  const createMutation = useCreateHotspot();
  const updateMutation = useUpdateHotspot();
  const deleteMutation = useDeleteHotspot();
  
  // Site content
  const { data: missionContent, isLoading: missionLoading } = useSiteContent("mission");
  const { data: heroHeadlineContent } = useSiteContent("hero_headline");
  const { data: heroSubtitleContent } = useSiteContent("hero_subtitle");
  const { data: heroCtaContent } = useSiteContent("hero_cta");
  const { data: homepageBgColorContent } = useSiteContent("homepage_bg_color");
  const { data: wizardInstagramLinkContent } = useSiteContent("wizard_instagram_link");
  const { data: wizardInstagramDescContent } = useSiteContent("wizard_instagram_desc");
  const updateSiteContent = useUpdateSiteContent();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHotspot, setEditingHotspot] = useState<Hotspot | null>(null);
  const [formData, setFormData] = useState<HotspotInsert>(emptyHotspot);
  const [missionText, setMissionText] = useState("");
  const [heroHeadline, setHeroHeadline] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [heroCta, setHeroCta] = useState("");
  const [homepageBgColor, setHomepageBgColor] = useState("");
  const [wizardInstagramLink, setWizardInstagramLink] = useState("");
  const [wizardInstagramDesc, setWizardInstagramDesc] = useState("");

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
    if (heroHeadlineContent?.content) {
      setHeroHeadline(heroHeadlineContent.content);
    }
  }, [heroHeadlineContent]);

  useEffect(() => {
    if (heroSubtitleContent?.content) {
      setHeroSubtitle(heroSubtitleContent.content);
    }
  }, [heroSubtitleContent]);

  useEffect(() => {
    if (heroCtaContent?.content) {
      setHeroCta(heroCtaContent.content);
    }
  }, [heroCtaContent]);

  useEffect(() => {
    if (homepageBgColorContent?.content) {
      setHomepageBgColor(homepageBgColorContent.content);
    }
  }, [homepageBgColorContent]);

  useEffect(() => {
    if (wizardInstagramLinkContent?.content) {
      setWizardInstagramLink(wizardInstagramLinkContent.content);
    }
  }, [wizardInstagramLinkContent]);

  useEffect(() => {
    if (wizardInstagramDescContent?.content) {
      setWizardInstagramDesc(wizardInstagramDescContent.content);
    }
  }, [wizardInstagramDescContent]);

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
      categoria: hotspot.categoria,
      zona: hotspot.zona || "",
      tags: hotspot.tags || [],
      ordine: hotspot.ordine,
    });
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


  const handleSaveHero = async () => {
    await updateSiteContent.mutateAsync({ key: "hero_headline", content: heroHeadline });
    await updateSiteContent.mutateAsync({ key: "hero_subtitle", content: heroSubtitle });
    await updateSiteContent.mutateAsync({ key: "hero_cta", content: heroCta });
    if (homepageBgColor) {
      await updateSiteContent.mutateAsync({ key: "homepage_bg_color", content: homepageBgColor });
    }
  };

  const handleSaveWizardInstagram = async () => {
    await updateSiteContent.mutateAsync({ key: "wizard_instagram_link", content: wizardInstagramLink });
    await updateSiteContent.mutateAsync({ key: "wizard_instagram_desc", content: wizardInstagramDesc });
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
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="hotspots" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Hotspots
              </TabsTrigger>
              <TabsTrigger value="contenuti" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Contenuti
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

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="zona">Zona</Label>
                          <Input
                            id="zona"
                            value={formData.zona || ""}
                            onChange={(e) => setFormData({ ...formData, zona: e.target.value })}
                            placeholder="Es: Messina, Palermo, Catania..."
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

              {/* Hotspots list */}
              <div className="space-y-4">
                {hotspots && hotspots.length > 0 ? (
                  hotspots.map((hotspot) => (
                    <Card key={hotspot.id} className="overflow-hidden">
                      <div className="flex items-start gap-4 p-4">
                        {/* Image thumbnail */}
                        {hotspot.foto_principale && (
                          <div className="flex-shrink-0">
                            <img
                              src={hotspot.foto_principale}
                              alt={hotspot.titolo}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                          </div>
                        )}
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-semibold text-lg truncate">{hotspot.titolo}</h3>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {hotspot.categoria && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground">
                                    {hotspot.categoria}
                                  </span>
                                )}
                                {hotspot.zona && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-olive/20 text-olive">
                                    📍 {hotspot.zona}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {hotspot.descrizione_breve}
                              </p>
                              {hotspot.tags && hotspot.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {hotspot.tags.filter(Boolean).map((tag, i) => (
                                    <span key={i} className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-muted/50 text-muted-foreground font-mono">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleOpenEdit(hotspot)}
                              >
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
                                      Questa azione non può essere annullata. L'hotspot "{hotspot.titolo}" sarà eliminato definitivamente.
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
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>Nessun hotspot presente.</p>
                    <p className="text-sm mt-1">Clicca "Nuovo Hotspot" per iniziare.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Tab Contenuti */}
            <TabsContent value="contenuti" className="space-y-6">
              <h2 className="font-heading text-2xl font-bold">Gestione Contenuti</h2>
              
              {/* Hero Content */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Homepage Hero
                  </CardTitle>
                  <CardDescription>
                    Headline, sottotitolo e testo del pulsante CTA nella homepage.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="hero_headline">Headline</Label>
                    <div className="flex gap-2">
                      <Input
                        id="hero_headline"
                        value={heroHeadline}
                        onChange={(e) => setHeroHeadline(e.target.value)}
                        placeholder="Es: Esplorazioni aliene in Sicilia"
                        className="flex-1"
                      />
                      <EmojiPicker onSelect={(emoji) => setHeroHeadline(heroHeadline + emoji)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hero_subtitle">Sottotitolo</Label>
                    <div className="flex gap-2">
                      <Textarea
                        id="hero_subtitle"
                        value={heroSubtitle}
                        onChange={(e) => setHeroSubtitle(e.target.value)}
                        placeholder="Es: Ti mostro posti iper selezionati..."
                        rows={3}
                        className="flex-1"
                      />
                      <EmojiPicker onSelect={(emoji) => setHeroSubtitle(heroSubtitle + emoji)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hero_cta">Testo Pulsante CTA</Label>
                    <div className="flex gap-2">
                      <Input
                        id="hero_cta"
                        value={heroCta}
                        onChange={(e) => setHeroCta(e.target.value)}
                        placeholder="Es: Portami via da qui"
                        className="flex-1"
                      />
                      <EmojiPicker onSelect={(emoji) => setHeroCta(heroCta + emoji)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="homepage_bg_color">Colore Sfondo Homepage (esadecimale)</Label>
                    <Input
                      id="homepage_bg_color"
                      value={homepageBgColor}
                      onChange={(e) => setHomepageBgColor(e.target.value)}
                      placeholder="Es: #D2F779"
                    />
                    {homepageBgColor && (
                      <div 
                        className="w-full h-8 rounded border"
                        style={{ backgroundColor: homepageBgColor }}
                      />
                    )}
                  </div>
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleSaveHero}
                      disabled={updateSiteContent.isPending || (
                        heroHeadline === heroHeadlineContent?.content && 
                        heroSubtitle === heroSubtitleContent?.content && 
                        heroCta === heroCtaContent?.content &&
                        homepageBgColor === (homepageBgColorContent?.content || "")
                      )}
                    >
                      {updateSiteContent.isPending && (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      )}
                      Salva Hero
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Wizard Instagram Link */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Wizard Instagram
                  </CardTitle>
                  <CardDescription>
                    Link al profilo Instagram per il pulsante "Scrivimi su Instagram" nel wizard.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="wizard_instagram_link">Link Instagram</Label>
                    <Input
                      id="wizard_instagram_link"
                      value={wizardInstagramLink}
                      onChange={(e) => setWizardInstagramLink(e.target.value)}
                      placeholder="Es: https://instagram.com/tuoprofilo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wizard_instagram_desc">Testo descrittivo CTA</Label>
                    <div className="flex gap-2 items-start">
                      <Textarea
                        id="wizard_instagram_desc"
                        value={wizardInstagramDesc}
                        onChange={(e) => setWizardInstagramDesc(e.target.value)}
                        placeholder="Es: Hai bisogno di itinerari super specifici..."
                        rows={3}
                        className="flex-1"
                      />
                      <EmojiPicker onSelect={(emoji) => setWizardInstagramDesc(wizardInstagramDesc + emoji)} />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleSaveWizardInstagram}
                      disabled={updateSiteContent.isPending || (
                        wizardInstagramLink === (wizardInstagramLinkContent?.content || "") &&
                        wizardInstagramDesc === (wizardInstagramDescContent?.content || "")
                      )}
                    >
                      {updateSiteContent.isPending && (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      )}
                      Salva Wizard Instagram
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Header Content */}

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
