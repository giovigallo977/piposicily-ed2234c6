
# Piano: Rimuovere CTA inutilizzati dal backend admin

## Problema
Nel pannello admin (tab Contenuti > Homepage Hero) c'e un campo "Testo Pulsante CTA" (`hero_cta`) che non viene usato da nessun componente nel frontend. La homepage non ha nessun pulsante CTA collegato a questa chiave.

## Cosa viene rimosso

Nel file `src/pages/Admin.tsx`:
- Rimuovere `useSiteContent("hero_cta")` (riga 46)
- Rimuovere lo state `heroCta` (riga 64)
- Rimuovere il `useEffect` che popola `heroCta` (righe 101-105)
- Rimuovere il campo input "Testo Pulsante CTA" dall'UI (righe 583-594)
- Rimuovere il salvataggio di `hero_cta` da `handleSaveHero` (riga 198)
- Rimuovere `heroCta` dalla condizione di disabilitazione del bottone "Salva Hero" (riga 617)
- Aggiornare la descrizione della card Hero rimuovendo il riferimento al "pulsante CTA"

## Cosa resta invariato
- Headline e Sottotitolo (usati nel frontend)
- Colore sfondo homepage (usato nel frontend)
- Testo CTA Esplora nella sezione categorie (usato nel frontend)
- Missione (usata nel frontend)
- Tutto il resto del pannello admin

## File coinvolti

| File | Azione |
|------|--------|
| `src/pages/Admin.tsx` | Rimuovere campo hero_cta, state, useEffect, e logica di salvataggio |
