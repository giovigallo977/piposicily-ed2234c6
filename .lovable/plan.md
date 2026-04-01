

## Trasformare la pagina itinerario in stile WeRoad (tappe numerate)

### Problema attuale
Entrando in un Day Trip/Walk, gli hotspot vengono mostrati come griglia di card indipendenti. L'utente vuole invece un layout a **itinerario sequenziale con tappe numerate**, ispirato a WeRoad.

### Nuovo layout della CollectionDetailPage

```text
┌─────────────────────────────────┐
│  ← Back         Titolo Itinerario │
├─────────────────────────────────┤
│  [Galleria foto hero - collection │
│   immagine + foto dei primi       │
│   hotspot in griglia/carousel]    │
├─────────────────────────────────┤
│  Descrizione collezione           │
├─────────────────────────────────┤
│  TAPPA 1                          │
│  ┌──────┐  Titolo hotspot         │
│  │ foto │  Zona · Categoria       │
│  └──────┘  ▼ (espandi)            │
│───────────────────────────────────│
│  TAPPA 2                          │
│  ┌──────┐  Titolo hotspot         │
│  │ foto │  Zona · Categoria       │
│  └──────┘  ▼ (espandi)            │
│───────────────────────────────────│
│  ...                              │
│───────────────────────────────────│
│  TAPPA N                          │
│  ┌──────┐  Titolo hotspot         │
│  │ foto │  Zona · Categoria       │
│  └──────┘  ▼ (espandi)            │
└─────────────────────────────────┘
```

Ogni tappa espansa mostra:
- Descrizione completa (con link cliccabili)
- Galleria foto
- Bottone NAVIGA (Google Maps)

### Modifiche

**1. Nuovo componente `src/components/ItineraryStageCard.tsx`**
- Layout orizzontale: thumbnail (150x100 circa) a sinistra, contenuto a destra
- Label "TAPPA {n}" sopra il titolo
- Titolo hotspot in bold
- Sottotitolo con zona
- Chevron per espandere/collassare (accordion)
- Contenuto espanso: descrizione completa, gallery, bottone NAVIGA
- Separatore tra tappe (linea orizzontale, come WeRoad)

**2. Riscrivere `src/pages/CollectionDetailPage.tsx`**
- Rimuovere la griglia di HotspotCard
- Aggiungere sezione hero con immagine della collezione
- Aggiungere descrizione collezione sotto l'hero
- Lista verticale di `ItineraryStageCard` numerate (TAPPA 1, 2, 3...)
- Mantenere email gate: dopo N tappe visibili, mostrare il `CollectionInlineBlock`
- Mantenere `EmailGateModal`

**3. Nessuna modifica al database**
- I dati esistenti (hotspots, collection_hotspots con ordine) sono sufficienti
- L'ordine delle tappe corrisponde al campo `ordine` in `collection_hotspots`

### Dettaglio tecnico

- Il componente `ItineraryStageCard` riceve `hotspot`, `stageNumber`, `onBeforeExpand`
- Usa `useTranslatedHotspot` per le traduzioni
- Tracking: `trackEvent("hotspot_view")` all'espansione della tappa
- Layout responsive: su mobile la thumbnail diventa piu piccola (100x75), su desktop resta 150x100
- Accordion nativo con stato `isExpanded` locale
- Il gate email continua a funzionare: le tappe oltre `visibleCount` sono nascoste dietro il blocco email

