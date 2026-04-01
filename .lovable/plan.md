

## Redesign CollectionDetailPage — Collage, Ratings, Map, Prenota

### Cosa cambia

**1. Collage foto hero**
Sostituire l'immagine singola con un collage di 4-5 foto prese automaticamente dalle `foto_principale` degli hotspot della collezione. Layout: 1 foto grande a sinistra + 3-4 piccole a destra (stile Airbnb/WeRoad).

**2. Sezione "Questo itinerario fa per me"**
Sotto il collage, aggiungere una sezione con parametri a stelle (1-5):
- Itinerario turistico
- Relax
- Natura e avventura
- Sforzo fisico
- Tipo di itinerario

Questi valori devono essere editabili dall'admin, quindi servono nuove colonne nel database sulla tabella `collections`.

**3. Layout a due colonne (desktop)**
- **Sinistra**: lista tappe (itinerario)
- **Destra**: immagine mappa dell'itinerario (screenshot Google Maps), cliccabile verso un link. Serve una nuova colonna `mappa_immagine` e `mappa_link` nella tabella `collections`.

Su mobile: colonna singola, mappa sopra le tappe.

**4. Bottone "Prenota la tua visita" nella tappa espansa**
Dentro `ItineraryStageCard`, nel contenuto espanso, aggiungere un bottone "Prenota la tua visita" accanto al bottone NAVIGA. Serve un nuovo campo `link_prenotazione` nella tabella `hotspots`.

**5. Descrizione itinerario**
Sotto il collage e i parametri, mostrare la descrizione della collezione (gia presente).

### Migrazione DB

```sql
-- Nuove colonne su collections per ratings e mappa
ALTER TABLE public.collections
  ADD COLUMN rating_turistico integer DEFAULT 0,
  ADD COLUMN rating_relax integer DEFAULT 0,
  ADD COLUMN rating_natura integer DEFAULT 0,
  ADD COLUMN rating_sforzo integer DEFAULT 0,
  ADD COLUMN rating_tipo integer DEFAULT 0,
  ADD COLUMN mappa_immagine text DEFAULT '',
  ADD COLUMN mappa_link text DEFAULT '';

-- Nuovo campo prenotazione su hotspots
ALTER TABLE public.hotspots
  ADD COLUMN link_prenotazione text DEFAULT '';
```

### File modificati

**`src/pages/CollectionDetailPage.tsx`**
- Hero: collage da `hotspots[0..4].foto_principale`
- Sezione rating con stelle (componente inline)
- Layout 2 colonne: tappe a sinistra, mappa a destra
- Descrizione sotto i rating

**`src/components/ItineraryStageCard.tsx`**
- Aggiungere bottone "Prenota la tua visita" nel contenuto espanso (visibile solo se `link_prenotazione` e presente)

**`src/hooks/useCollections.ts`**
- Aggiornare interfaccia `Collection` con i nuovi campi

**`src/hooks/useHotspots.tsx`**
- Aggiungere `link_prenotazione` all'interfaccia `Hotspot` e alla query select

**Admin (pannello)**
- Aggiungere campi per i rating (slider 1-5), immagine mappa, link mappa nella gestione collezioni
- Aggiungere campo link prenotazione nella gestione hotspot

### Nessun file eliminato

