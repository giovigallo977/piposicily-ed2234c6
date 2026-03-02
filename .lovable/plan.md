

## Piano: Aggiungere controllo colore font Hero dall'admin

### Stato attuale
- **Sfondo Hero immagine**: già implementato (`hero_bg_image`) ✓
- **Sfondo colore**: già implementato (`homepage_bg_color`) ✓  
- **Colore font Hero**: NON presente — attualmente i testi sono bianchi fissi se c'è immagine di sfondo, altrimenti `text-foreground`

### Cosa aggiungere

**Nuova chiave DB**: `hero_font_color` in `site_content`

### Modifiche

1. **`src/pages/Admin.tsx`**
   - Aggiungere stato `heroFontColor` + `useSiteContent("hero_font_color")`
   - Aggiungere campo input colore nella sezione "Homepage Hero" (stesso pattern di `homepage_bg_color` con preview colore)
   - Salvare in `handleSaveHero` e aggiungere al check dirty del bottone

2. **`src/components/HeroSection.tsx`**
   - Leggere `hero_font_color` dal DB con `useSiteContent("hero_font_color")`
   - Applicare il colore come `style={{ color: heroFontColor }}` ai testi headline, subtitle, CTA e indicatore scroll
   - Fallback: se non impostato, comportamento attuale (bianco con bg image, foreground senza)

### Flusso nell'admin

```text
Homepage Hero card:
  - Headline          [input]
  - Sottotitolo        [textarea]
  - Colore Sfondo      [input hex + preview] (già presente)
  - Immagine Sfondo    [upload] (già presente)
  - Colore Font Hero   [input hex + preview] ← NUOVO
  [Salva Hero]
```

