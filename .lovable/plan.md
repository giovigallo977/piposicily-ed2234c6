
## Piano: Pulsante Instagram nella pagina Esplora

### Panoramica

Aggiungere un pulsante "Scrivimi su Instagram" fisso in basso nella pagina ExplorePage, all'interno di una barra bianca. Il pulsante utilizzerà lo stesso link configurato nel backend (`wizard_instagram_link`).

---

### Modifiche da implementare

#### File: `src/pages/ExplorePage.tsx`

**1. Importare l'hook per il contenuto dal backend**
```typescript
import { useSiteContent } from "@/hooks/useSiteContent";
```

**2. Aggiungere il fetch del link Instagram nel componente**
```typescript
const { data: instagramLinkContent } = useSiteContent("wizard_instagram_link");
const instagramLink = instagramLinkContent?.content || "#";
```

**3. Aggiungere padding-bottom al main**

Per evitare che le ultime card vengano nascoste dalla barra fissa, aggiungere `pb-24` al contenitore main.

**4. Aggiungere la barra fissa in basso**

Struttura:
```
┌─────────────────────────────────────┐
│  [Scrivimi su Instagram] (nero)     │
└─────────────────────────────────────┘
```

Dettagli tecnici:
- Posizione: `fixed bottom-0 left-0 right-0`
- Background: `bg-white` con ombra verso l'alto (`shadow-[0_-2px_10px_rgba(0,0,0,0.1)]`)
- Padding: `py-4 px-6`
- Z-index: `z-50` per stare sopra i contenuti
- Il pulsante centrato con `flex justify-center`

**5. Stile del pulsante**

Identico a quello del wizard:
- Background: `bg-black`
- Testo: bianco, bold
- Forma: pill (`rounded-full`)
- Hover: scala leggera (`hover:scale-105`)
- Apertura in nuova tab: `target="_blank" rel="noopener noreferrer"`

---

### Codice della barra fissa

```tsx
{/* Fixed Instagram CTA bar */}
<div className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] py-4 px-6">
  <div className="flex justify-center">
    <a
      href={instagramLink}
      target="_blank"
      rel="noopener noreferrer"
      className="px-6 py-3 bg-black text-white font-bold rounded-full transition-transform duration-200 hover:scale-105 font-sans"
    >
      {t("wizardInstagramBtn")}
    </a>
  </div>
</div>
```

---

### Struttura finale della pagina

```
┌────────────────────────────────────┐
│ Header (sticky top)                │
├────────────────────────────────────┤
│ Filtri attivi (opzionale)          │
├────────────────────────────────────┤
│                                    │
│      Hotspot Cards                 │
│      (scrollabili)                 │
│                                    │
│      ...                           │
│                                    │
│      [padding-bottom per barra]    │
├────────────────────────────────────┤
│ [Scrivimi su Instagram] (fixed)    │
└────────────────────────────────────┘
```

---

### Riepilogo modifiche

| File | Azione |
|------|--------|
| `src/pages/ExplorePage.tsx` | Importare hook, aggiungere fetch link, barra fissa con pulsante |

---

### Note

- Non servono nuove chiavi database: si riutilizza `wizard_instagram_link` già esistente
- Non servono nuove traduzioni: si riutilizza `wizardInstagramBtn` già esistente
- Il pulsante sarà sempre visibile mentre l'utente scorre le schede hotspot
