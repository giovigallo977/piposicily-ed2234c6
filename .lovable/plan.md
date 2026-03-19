

## Problema

Il testo "Esplorazioni aliene in Sicilia" appare brevemente al caricamento perché è il fallback hardcoded in `LanguageContext.tsx` (riga 55). Viene mostrato finché la query al database (`site_content` con key `hero_headline`) non è completata.

## Soluzione

Due modifiche semplici:

### 1. Non mostrare il fallback durante il caricamento
In `src/components/HeroSection.tsx`, controllare lo stato di loading della query `useSiteContent("hero_headline")`. Finché è in caricamento, mostrare il testo vuoto o uno skeleton/placeholder invece del fallback vecchio.

### 2. Aggiornare i fallback in `LanguageContext.tsx`
Cambiare i testi hardcoded nella sezione Hero con valori neutri o vuoti, così anche se appaiono per un istante non mostrano contenuto obsoleto:
- `heroHeadline`: da "Esplorazioni aliene in Sicilia" → stringa vuota `""`
- `heroSubheadline`: aggiornare di conseguenza

### File coinvolti
- `src/components/HeroSection.tsx` — evitare flash del fallback durante loading
- `src/contexts/LanguageContext.tsx` — aggiornare/svuotare i fallback hardcoded della Hero

