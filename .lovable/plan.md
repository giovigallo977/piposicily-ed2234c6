

## Piano: Ristrutturazione Homepage con Missione e Nuovo Header

### Panoramica delle modifiche

1. **Micro-copy sotto CTA** - Cambiare da "Zona → Mood → Esplora in libertà" a nuovo testo descrittivo
2. **Spostare contenuto Missione** - Aggiungere sotto il carosello (senza titolo)
3. **Rimuovere hamburger menu** - Sostituire con selettore lingua IT/EN più compatto

---

### 1. Traduzioni (`src/contexts/LanguageContext.tsx`)

**Aggiungere nuova chiave per il sublabel:**

```typescript
// Italiano
heroSublabel: "Scopri gli hotspot alieni in base al tuo mood e alla zona che vuoi esplorare",

// English
heroSublabel: "Discover alien hotspots based on your mood and the area you want to explore",
```

---

### 2. Header Semplificato (`src/components/MinimalHeader.tsx`)

**Rimuovere:**
- Menu hamburger (Sheet component)
- Import di Menu, Link, Sheet components

**Aggiungere:**
- Selettore lingua compatto a sinistra (più piccolo, `text-xs`)

**Layout nuovo:**
```
[IT|EN]          Pipo 👽          [spazio vuoto]
```

**Codice aggiornato:**
```tsx
const MinimalHeader = ({ bgColor }: MinimalHeaderProps) => {
  const { language, setLanguage } = useLanguage();
  
  return (
    <header className="py-4" style={{ backgroundColor: bgColor || undefined }}>
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Language selector - Left (più piccolo) */}
          <div className="flex items-center gap-0.5 text-xs text-muted-foreground">
            <button 
              onClick={() => setLanguage("it")} 
              className={`px-1.5 py-0.5 rounded transition-colors ${
                language === "it" ? "text-foreground font-medium" : "hover:text-foreground/70"
              }`}
            >
              IT
            </button>
            <span className="text-border">|</span>
            <button 
              onClick={() => setLanguage("en")} 
              className={`px-1.5 py-0.5 rounded transition-colors ${
                language === "en" ? "text-foreground font-medium" : "hover:text-foreground/70"
              }`}
            >
              EN
            </button>
          </div>

          {/* Logo centered */}
          <div className="flex items-center">
            <h1 className="font-sans font-bold italic tracking-tight text-foreground text-2xl">
              Pipo
            </h1>
            <img ... />
          </div>

          {/* Empty space for balance */}
          <div className="w-10" />
        </div>
      </div>
    </header>
  );
};
```

---

### 3. Hero Section con Missione (`src/components/HeroSection.tsx`)

**Aggiungere sotto il carosello:**
- Fetch del contenuto "mission" dal database
- Mostrare il testo (senza titolo "La missione di Pipo")
- Stesso stile del contenuto nella pagina Mission attuale

**Nuove importazioni:**
```typescript
import { useTranslatedContent } from "@/hooks/useTranslation";
import { Loader2 } from "lucide-react";
```

**Nuova struttura:**
```tsx
// Fetch mission content
const { data: missionContent, isLoading: missionLoading } = useSiteContent("mission");
const { translatedText: translatedMission, isTranslating } = useTranslatedContent(missionContent?.content);

return (
  <section ...>
    <div className="max-w-4xl mx-auto w-full md:flex md:flex-col md:items-center">
      {/* Headline */}
      <h1>...</h1>
      
      {/* Subtitle */}
      <p>...</p>
      
      {/* CTA Button */}
      <div>
        <button>Portami via da qui</button>
        <p className="text-[13px]">Scopri gli hotspot alieni...</p>
      </div>
      
      {/* Photo Carousel */}
      {carouselPhotos.length > 0 && <div>...</div>}
      
      {/* Mission Content - NUOVO (sotto il carosello) */}
      {missionContent && (
        <div className="w-full mt-16 max-w-md md:mx-auto">
          {missionLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <p className={`font-sans text-base font-medium text-foreground leading-relaxed text-center whitespace-pre-wrap ${isTranslating ? 'opacity-50' : ''}`}>
              {translatedMission || missionContent.content}
            </p>
          )}
        </div>
      )}
    </div>
  </section>
);
```

---

### 4. Index Page (`src/pages/Index.tsx`)

**Modificare:**
- Rimuovere `min-h-screen` per permettere scroll
- Aggiungere padding bottom per lo spazio

```tsx
<div 
  className="pb-16"
  style={{ backgroundColor: bgColor || undefined }}
>
  <MinimalHeader bgColor={bgColor} />
  <HeroSection onCtaClick={handleOpenWizard} bgColor={bgColor} />
</div>
```

---

### Riepilogo file da modificare

| File | Modifiche |
|------|-----------|
| `src/contexts/LanguageContext.tsx` | Aggiornare `heroSublabel` con nuovo testo |
| `src/components/MinimalHeader.tsx` | Rimuovere hamburger, aggiungere selettore lingua compatto |
| `src/components/HeroSection.tsx` | Aggiungere contenuto Missione sotto carosello |
| `src/pages/Index.tsx` | Permettere scroll verticale |

---

### Layout finale Homepage (scrollabile)

```
┌─────────────────────────────────────┐
│  [IT|EN]      Pipo 👽               │  ← Header
├─────────────────────────────────────┤
│                                     │
│   Esplorazioni aliene in Sicilia    │  ← Headline
│                                     │
│   Ti mostro posti iper selezionati..│  ← Subtitle
│                                     │
│   [    Portami via da qui     ]     │  ← CTA
│   Scopri gli hotspot alieni in      │  ← Nuovo sublabel
│   base al tuo mood e alla zona...   │
│                                     │
│   [📷 carousel photos 📷 📷]         │  ← Carosello
│                                     │
│   ─────────────────────────────     │
│                                     │
│   Testo della missione di Pipo      │  ← Contenuto Missione
│   senza il titolo, centrato...      │    (scrollando)
│                                     │
└─────────────────────────────────────┘
```

