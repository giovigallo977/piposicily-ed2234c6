

## Piano: Condivisione + Preferiti per Hotspot

### Panoramica

Aggiungere due nuove funzionalità alle card hotspot:
1. **Pulsante Condividi** - copia il link o condivide su WhatsApp
2. **Pulsante Preferiti** - salva hotspot con cuoricino (localStorage)

---

### 1. Hook Preferiti (nuovo file)

**File: `src/hooks/useFavorites.ts`**

```typescript
// Gestisce i preferiti in localStorage
const STORAGE_KEY = "pipo-favorites";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // Carica da localStorage al mount
  // Toggle: aggiunge/rimuove ID
  // isFavorite: controlla se ID è presente
  
  return { favorites, toggleFavorite, isFavorite };
};
```

---

### 2. Modifiche HotspotCard

**File: `src/components/HotspotCard.tsx`**

**Nuove importazioni:**
```typescript
import { Heart, Share2 } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { toast } from "sonner";
```

**Nuova logica:**
```typescript
const { toggleFavorite, isFavorite } = useFavorites();
const isLiked = isFavorite(hotspot.id);

const handleShare = async () => {
  const url = `${window.location.origin}/esplora?hotspot=${hotspot.id}`;
  
  if (navigator.share) {
    // Mobile: usa API nativa
    await navigator.share({ title, url });
  } else {
    // Desktop: copia link
    await navigator.clipboard.writeText(url);
    toast.success("Link copiato!");
  }
};
```

**Nuovi pulsanti nell'header della card:**

```
┌────────────────────────────────────────────┐
│ [Titolo]                    ❤️  📤  [+/-]  │
└────────────────────────────────────────────┘
```

**Posizione:** A destra del titolo, prima del bottone espansione:
- **Cuore (❤️):** toggle preferiti, rosso se attivo
- **Share (📤):** apre menu condivisione o copia link

---

### 3. Traduzioni

**File: `src/contexts/LanguageContext.tsx`**

Nuove chiavi:
```typescript
// Italiano
share: "Condividi",
addToFavorites: "Aggiungi ai preferiti",
removeFromFavorites: "Rimuovi dai preferiti",
linkCopied: "Link copiato!",
shareViaWhatsApp: "Condividi su WhatsApp",

// English
share: "Share",
addToFavorites: "Add to favorites",
removeFromFavorites: "Remove from favorites",
linkCopied: "Link copied!",
shareViaWhatsApp: "Share via WhatsApp",
```

---

### 4. Stile dei pulsanti

**Cuore Preferiti:**
```css
/* Non attivo */
w-9 h-9 rounded-full bg-muted text-foreground

/* Attivo */
w-9 h-9 rounded-full bg-red-100 text-red-500
```

**Icona Share:**
```css
w-9 h-9 rounded-full bg-muted text-foreground hover:bg-muted/80
```

---

### 5. Struttura header card aggiornata

```tsx
<div className="flex items-start justify-between gap-2">
  {/* Titolo */}
  <h2 className="flex-1 min-w-0 ...">
    {translated.titolo}
  </h2>
  
  {/* Azioni */}
  <div className="flex items-center gap-1.5 flex-shrink-0">
    {/* Cuore preferiti */}
    <button onClick={() => toggleFavorite(hotspot.id)}>
      <Heart className={isLiked ? "fill-red-500 text-red-500" : ""} />
    </button>
    
    {/* Share */}
    <button onClick={handleShare}>
      <Share2 />
    </button>
    
    {/* Espansione +/- */}
    <button onClick={() => setIsExpanded(!isExpanded)}>
      {isExpanded ? <Minus /> : <Plus />}
    </button>
  </div>
</div>
```

---

### Riepilogo file da modificare/creare

| File | Azione |
|------|--------|
| `src/hooks/useFavorites.ts` | **NUOVO** - Hook per gestione preferiti |
| `src/components/HotspotCard.tsx` | Aggiungere pulsanti cuore e share |
| `src/contexts/LanguageContext.tsx` | Aggiungere traduzioni |

---

### Note tecniche

- **localStorage** per i preferiti (nessun login richiesto)
- **navigator.share** per condivisione nativa su mobile
- **Clipboard API** come fallback per desktop
- I preferiti persistono tra sessioni
- Feedback visivo immediato con animazione cuore

