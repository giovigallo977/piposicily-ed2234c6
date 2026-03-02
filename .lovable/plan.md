

## Piano: Sfondo immagine per la Hero Section

### Cosa cambia

Aggiungere un'immagine di sfondo dietro la hero section (fullscreen), caricabile dall'admin panel tramite la chiave `hero_bg_image` in `site_content`. L'immagine coprira' l'intera area hero con un overlay scuro semi-trasparente per mantenere la leggibilita' del testo. I testi passeranno a colore bianco quando l'immagine e' presente.

### File da modificare

**1. `src/components/HeroSection.tsx`**
- Aggiungere `useSiteContent("hero_bg_image")` per caricare l'URL dell'immagine di sfondo
- Dentro il div `min-h-[100dvh]`, se l'immagine esiste:
  - Renderizzare un `<img>` assoluto con `object-cover` che copre tutto il container
  - Aggiungere un overlay `<div>` con gradiente scuro semi-trasparente (`bg-black/40`)
  - I testi (headline, subtitle, CTA, bottone) cambiano colore a `text-white` quando c'e' l'immagine di sfondo
- Il `bgColor` inline continua a funzionare come fallback quando non c'e' immagine

**2. `src/pages/Admin.tsx`**
- Aggiungere un campo per caricare/inserire l'URL dell'immagine di sfondo hero (`hero_bg_image`)
- Riutilizzare il pattern gia' presente per le immagini categoria (input URL o componente ImageUpload)
- Salvare con `updateSiteContent` alla chiave `hero_bg_image`

### Dettagli tecnici

Struttura del container hero con immagine:

```text
<div class="relative min-h-[100dvh] ...">
  <!-- BG Image (absolute, behind everything) -->
  <img src={heroBgImage} class="absolute inset-0 w-full h-full object-cover" />
  <!-- Overlay for readability -->
  <div class="absolute inset-0 bg-black/40" />
  <!-- Existing content (z-10) -->
  ...
</div>
```

- L'immagine funziona su desktop e PWA/mobile grazie a `object-cover` + `100dvh`
- Nessuna modifica al database necessaria: si riutilizza la tabella `site_content` esistente

