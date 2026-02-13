

# Piano: Aggiungere scheda "Collezioni" e testo mission statico + freccia scroll

## Cosa cambia

Sotto la griglia 2x2 delle categorie, aggiungere:

1. **Una quinta scheda "Collezioni"** - stile identico alle 4 categorie (foto quadrata, bordi arrotondati, titolo bianco sovrapposto), a larghezza piena sotto la griglia 2x2
2. **Testo mission lungo e statico** - tutto il contenuto "Chi e Pipo", "Cosa fa Pipo", "Per chi e Pipo", etc. scritto direttamente nel componente, in formato verticale mobile-first
3. **Freccia scroll-down** - una piccola freccia in basso alla pagina che indica di scorrere per leggere il contenuto

## Rimuovere

- La sezione Mission attuale che carica da database (`useSiteContent("mission")` e `useSiteContent("mission_part2")`) e tutti gli hook correlati (`translatedMission`, `translatedMissionPart2`, `isTranslating1`, `isTranslating2`)
- Il bottone CTA secondario ("esplora gli hotspot di pipo")

## Modifiche tecniche

### `src/components/HeroSection.tsx`

- **Aggiungere** dopo la griglia 2x2: una scheda "Collezioni" a larghezza piena (stessa estetica delle altre 4 card - rounded-2xl, aspect ratio piu basso tipo 16:9, titolo bianco sovrapposto). Click naviga a `/esplora` senza filtro categoria.
- **Sostituire** la sezione Mission dinamica con il testo statico fornito, strutturato con titoli in bold e paragrafi. Ogni sezione ("Chi e Pipo", "Cosa fa Pipo", etc.) sara un blocco con titolo `h2` e testo sotto.
- **Aggiungere** una piccola freccia animata (ChevronDown da lucide-react) in fondo alla pagina, centrata, che pulsa leggermente per indicare che c'e contenuto sotto.
- **Rimuovere** gli hook `useSiteContent("mission")`, `useSiteContent("mission_part2")` e le relative traduzioni, dato che il testo e ora hardcoded.
- **Rimuovere** il bottone CTA secondario e la prop `onCtaClick` (non piu necessaria).

### `src/pages/Index.tsx`

- Rimuovere la prop `onCtaClick` e la funzione `handleOpenWizard` dato che il bottone CTA secondario viene rimosso dal HeroSection.

### Struttura del testo mission

Il testo verra organizzato in sezioni con titoli bold, testo normale, e liste puntate dove indicato. Layout verticale, mobile-first, testo allineato a sinistra.

## File coinvolti

| File | Modifica |
|------|----------|
| `src/components/HeroSection.tsx` | Aggiungere scheda Collezioni, testo mission statico, freccia scroll, rimuovere mission dinamica |
| `src/pages/Index.tsx` | Rimuovere handleOpenWizard e prop onCtaClick |

