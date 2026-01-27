
## Piano: Cache-busting PWA + Cleanup + Ottimizzazioni

### 1. Cache-busting per icone PWA

**Problema**: Le icone PWA vengono cachate dal sistema operativo quando l'app viene aggiunta alla home screen. Anche se aggiorniamo le icone, gli utenti esistenti vedono ancora quella vecchia.

**Soluzione**: Aggiungere un parametro di versione alle icone nel manifest.

**File: `vite.config.ts`**
Modificare i percorsi delle icone aggiungendo `?v=2`:
```typescript
icons: [
  {
    src: "/icon-192.png?v=2",
    sizes: "192x192",
    type: "image/png",
    purpose: "any maskable",
  },
  {
    src: "/icon-512.png?v=2", 
    sizes: "512x512",
    type: "image/png",
    purpose: "any maskable",
  },
  {
    src: "/apple-touch-icon.png?v=2",
    sizes: "180x180",
    type: "image/png",
  },
],
```

**File: `public/manifest.json`**
Stesso aggiornamento:
```json
"icons": [
  {
    "src": "/icon-192.png?v=2",
    "sizes": "192x192",
    "type": "image/png",
    "purpose": "any maskable"
  },
  {
    "src": "/icon-512.png?v=2",
    "sizes": "512x512", 
    "type": "image/png",
    "purpose": "any maskable"
  },
  {
    "src": "/apple-touch-icon.png?v=2",
    "sizes": "180x180",
    "type": "image/png"
  }
]
```

**File: `index.html`**
Aggiornare il link apple-touch-icon:
```html
<link rel="apple-touch-icon" href="/apple-touch-icon.png?v=2" />
```

---

### 2. Pagina "La missione di Pipo" - Verifica corsivo

**Stato attuale**: Il testo nella pagina Mission.tsx è **già senza corsivo**. La linea 53 ha:
```tsx
<p className="font-medium text-foreground leading-relaxed whitespace-pre-wrap font-sans text-center text-base">
```

Nessuna modifica necessaria - il corsivo è già stato rimosso.

---

### 3. Rimozione codice e asset inutilizzati

**File da eliminare:**
- `src/assets/pipo-surf.png` - non usato in nessun file del progetto

---

### 4. Ottimizzazioni performance

**Già implementate nel progetto:**
- PWA con auto-update (`skipWaiting: true`, `clientsClaim: true`)
- Caching intelligente (NetworkFirst per API, CacheFirst per immagini)
- Compressione immagini ottimizzata per mobile (max 1.5MB, 1600px)
- Check aggiornamenti ogni 60 secondi + su visibility change

**Nessun codice morto trovato** - il codebase è già stato pulito nelle iterazioni precedenti.

---

### Riepilogo modifiche

| File | Modifica |
|------|----------|
| `vite.config.ts` | Aggiungere `?v=2` alle icone PWA |
| `public/manifest.json` | Aggiungere `?v=2` alle icone PWA |
| `index.html` | Aggiungere `?v=2` al link apple-touch-icon |
| `src/assets/pipo-surf.png` | Eliminare (non usato) |

---

### Nota importante per l'icona su telefono

Anche con cache-busting, gli utenti che hanno **già** installato l'app dovranno:
1. Rimuovere l'app dalla home screen
2. Reinstallarla dal browser

Questo perché l'icona viene copiata localmente dal sistema operativo al momento dell'installazione. Il cache-busting garantisce che i **nuovi** utenti o chi reinstalla vedranno l'icona corretta.
