
# Piano: Refresh UI Homepage stile Notion + Illustrazioni

## Obiettivo
Rendere la homepage di Pipo pulita e minimale (stile Notion/Tally), con illustrazioni leggere a tema viaggio/esplorazione. Le modifiche riguardano SOLO la homepage. Le pagine interne (Esplora, Hotspot) restano invariate. Il logo "Pipo + alieno" non viene toccato.

## Cosa cambia

### 1. Palette e CSS (`src/index.css`)
- Background homepage: bianco puro con tanto spazio
- Testo: grigio scuro (gia in linea)
- Accent soft: mantenere il verde Pipo (`--olive`) come unico colore accent
- Rimuovere eventuali sfumature "turistiche"

### 2. Illustrazioni SVG inline (`src/components/HomepageIllustrations.tsx`)
Creare un componente con piccole illustrazioni SVG inline stile "handmade" / line-art con colori piatti. Temi:
- **Hero**: figura con zaino che cammina (medium, accanto al testo headline)
- **Vicino alle card categorie**: piccole icone sparse (tenda, jeep, coppia che esplora, bussola)
- **Vicino alla sezione missione**: figura seduta con mappa

Le illustrazioni saranno SVG inline (nessun file esterno), leggere, con tratto nero sottile e fill accent soft (verde Pipo diluito, beige). Stile simile alle immagini di riferimento Notion/Tally: handmade, espressive, minimali.

### 3. HeroSection (`src/components/HeroSection.tsx`)
- Aggiungere illustrazione backpacker accanto all'headline (layout flex su desktop: testo a sinistra, illustrazione a destra)
- Aumentare spaziatura verticale tra le sezioni (piu respiro)
- Card categorie: bordi piu sottili, ombre piu leggere, stile piu "flat"
- Aggiungere piccole illustrazioni decorative sparse intorno alla griglia categorie (posizionate absolute, opacity ridotta)
- Sezione missione: piccola illustrazione a lato

### 4. Index page (`src/pages/Index.tsx`)
- Nessun cambio strutturale, solo passaggio props se necessario

### 5. Nessun cambio a pagine interne
- `ExplorePage.tsx`, `HotspotCard.tsx`, `Admin.tsx` restano identici

## Reversibilita
Le illustrazioni sono in un componente separato (`HomepageIllustrations.tsx`). Se non piacciono, basta rimuovere quel componente e i relativi import dalla HeroSection per tornare alla versione attuale.

## Dettagli tecnici

| File | Azione |
|------|--------|
| `src/components/HomepageIllustrations.tsx` | NUOVO - SVG inline per tutte le illustrazioni (backpacker, tenda, jeep, coppia, bussola, persona con mappa) |
| `src/components/HeroSection.tsx` | Aggiungere illustrazioni dal nuovo componente, aumentare spaziatura, rendere card piu flat |
| `src/index.css` | Piccoli ritocchi spaziatura se necessari |

## Nota importante
Questa e una prova. Se il risultato non piace, il rollback e semplice: basta rimuovere `HomepageIllustrations.tsx` e ripristinare `HeroSection.tsx` alla versione precedente (o usare il version history di Lovable).
