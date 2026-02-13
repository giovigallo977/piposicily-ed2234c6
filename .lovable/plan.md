

# Piano: Pulizia codice e ottimizzazione mobile-first

## Cosa viene rimosso

### 1. File `src/App.css` - ELIMINARE
Boilerplate Vite (`.logo`, `.read-the-docs`, `#root` con `max-width` e `padding`). Non e importato da nessuna parte. File completamente inutile.

### 2. Font inutilizzati in `src/index.css`
Molti font caricati da Google Fonts non sono mai usati nel codice:
- **Playfair Display** - mai usato
- **Bebas Neue** - mai usato
- **Suez One** - mai usato
- **Young Serif** - mai usato
- **Cardo** - mai usato
- **Cinzel** - mai usato
- **Eczar** - mai usato
- **Rubik Lines** - mai usato (solo Rubik Bubbles serve)

Mantenere solo: **Inter**, **Nunito**, **Roboto Mono**, **Rubik Bubbles**.
Questo riduce il tempo di caricamento della pagina in modo significativo.

### 3. Colori CSS inutilizzati in `src/index.css`
Nessun componente usa questi colori: `forest-green`, `magenta`, `lavender-vivid`, `sunny-yellow`, `mint`, `lavender`, `warm-yellow`. Rimuoverli dalle variabili CSS e dal tailwind config.

### 4. Font families inutilizzati in `tailwind.config.ts`
Rimuovere: `display` (Playfair), `claim` (Bebas Neue), `friendly` (duplica Nunito/body), `serif`. Mantenere: `sans`, `brand`, `heading`, `body`, `mono`, `bubbles`.

### 5. Tema dark in `src/index.css`
L'app non usa dark mode (nessun toggle, nessuna classe `.dark` nel codice app). Rimuovere il blocco `.dark { ... }` per snellire il CSS. I componenti UI shadcn che lo referenziano non ne sono impattati.

### 6. Font extra in `index.html`
Rimuovere i link a font non usati:
- `fonts.cdnfonts.com/css/more-sugar` - non usato
- `fonts.cdnfonts.com/css/dreaming-outloud-sans` - non usato
- `fonts.googleapis.com/css2?family=Oswald` - non usato
- `use.typekit.net/fyc2qfe.css` - non usato

---

## Cosa viene ottimizzato per mobile-first

### 7. `src/pages/Index.tsx` - Rimuovere padding desktop
Il `pb-16` e sufficiente. Aggiungere `overflow-x-hidden` per evitare scroll orizzontale su mobile.

### 8. `src/pages/ExplorePage.tsx` - Padding mobile
Verificare che la griglia sia single-column su mobile (gia `grid-cols-1`). Aggiungere `pb-24` per spazio sotto la CTA bar fissa (gia presente).

### 9. `src/components/HotspotCard.tsx` - Touch target
I bottoni di espansione (+/-) hanno gia `w-11 h-11` (44px), conforme alle linee guida touch. OK.

---

## File coinvolti

| File | Azione |
|------|--------|
| `src/App.css` | Eliminare completamente |
| `src/index.css` | Rimuovere font inutilizzati, colori inutilizzati, tema dark |
| `index.html` | Rimuovere link a font esterni non usati |
| `tailwind.config.ts` | Rimuovere font families e colori inutilizzati |

## Cosa NON cambia

- Tutte le pagine e i componenti funzionali (Admin, HeroSection, HotspotCard, Wizard, Explore, Mission)
- Il layout e la struttura delle card
- Il sistema di traduzione e i hook
- Il backend e la tabella site_content

