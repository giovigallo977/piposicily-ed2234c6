
# Piano: Pulizia flusso - Solo Landing + Categorie + Hotspot

## Obiettivo

Mantenere solo il percorso principale: **Homepage (landing + categorie + missione) -> Card categoria -> Pagina hotspot filtrata**. Tutto cio che esce da questo iter viene rimosso.

## Cosa cambia

### 1. Card "Collezioni" diventa una categoria vera
La card larga nella homepage attualmente porta a `/esplora` senza filtro. Va cambiata per navigare a `/esplora?categoria=Collezioni`, esattamente come le altre 4 categorie.

**File: `src/components/HeroSection.tsx`**
- Cambiare `onClick={() => navigate("/esplora")}` in `onClick={() => handleCategoryClick("Collezioni")}`
- Questo fa si che anche Collezioni filtri gli hotspot per categoria

### 2. Rimuovere la pagina `/missione`
La pagina separata `/missione` non serve perche la missione resta gia visibile nella homepage.

**File da eliminare:** `src/pages/Mission.tsx`

**File: `src/App.tsx`**
- Rimuovere import di `Mission`
- Rimuovere la route `/missione`

### 3. Pulizia traduzioni inutilizzate
Rimuovere da `src/contexts/LanguageContext.tsx` le chiavi mai usate nel codice:
- `claimTiAiuta`, `claimQuando`, `claimRisolve`, `claimCome` (label Claim mai referenziate)
- `heroSecondaryCtaBtn`, `heroSecondaryCtaSublabel` (vecchi CTA mai usati)
- `foundResults`, `results` (mai usati nell'explore page)

### 4. Rimuovere la freccia scroll (ChevronDown)
L'indicatore "scroll giu" animato nella homepage non serve a nulla nel flusso.

**File: `src/components/HeroSection.tsx`**
- Rimuovere il blocco ChevronDown e l'import

## File coinvolti

| File | Azione |
|------|--------|
| `src/pages/Mission.tsx` | Eliminare |
| `src/App.tsx` | Rimuovere route `/missione` e import Mission |
| `src/components/HeroSection.tsx` | Collezioni naviga a `/esplora?categoria=Collezioni`, rimuovere ChevronDown |
| `src/contexts/LanguageContext.tsx` | Rimuovere traduzioni inutilizzate |

## Cosa resta invariato

- Homepage: header, headline, subtitle, griglia 4 categorie, card Collezioni, sezione missione
- Pagina `/esplora` con filtro categorie e card hotspot con effetto lock
- Pagina `/admin` con gestione contenuti, categorie e hotspot
- Pagina `/auth` per login admin
- Sistema traduzioni IT/EN (solo le chiavi effettivamente usate)
