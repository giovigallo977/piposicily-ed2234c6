

## Modifiche alla pagina itinerario e admin collezioni

### Cosa cambia

**1. Rinominare "Tipo di Itinerario" → "Cultura"**
- Nel DB: rinominare `rating_tipo` in `rating_cultura` (migrazione)
- Aggiornare `Collection` interface, admin form, e CollectionDetailPage

**2. Aggiungere "?" al titolo rating**
- "Questo itinerario fa per me" → "Questo itinerario fa per me?"

**3. Mappa itinerario più grande nella pagina pubblica**
- Sidebar mappa: da `lg:w-[300px]` a `lg:w-[380px]` e altezza minima più generosa

**4. Nuova sezione "Prenota per visite e cibo"**
- Nuova colonna DB `info_prenotazioni` (text) sulla tabella `collections`
- Nella CollectionDetailPage, sotto la descrizione, mostrare una sezione con titolo "Prenota per visite e cibo" e il testo di `info_prenotazioni`
- Nell'admin, aggiungere un Textarea per compilare questo campo

**5. Rimuovere campo "Immagine Copertina" dall'admin**
- Il collage viene generato automaticamente dalle foto degli hotspot, quindi il campo singolo `immagine` non serve più nell'editor (resta nel DB per retrocompatibilità)

### Migrazione DB

```sql
ALTER TABLE public.collections
  RENAME COLUMN rating_tipo TO rating_cultura;

ALTER TABLE public.collections
  ADD COLUMN info_prenotazioni text DEFAULT '';
```

### File modificati

**`src/hooks/useCollections.ts`**
- Rinominare `rating_tipo` → `rating_cultura` nell'interface Collection e CollectionInsert

**`src/pages/CollectionDetailPage.tsx`**
- Titolo: "Questo itinerario fa per me?"
- Rating "Tipo di itinerario" → "Cultura"
- Mappa sidebar più larga
- Nuova sezione "Prenota per visite e cibo" sotto la descrizione

**`src/components/AdminCollectionsTab.tsx`**
- Slider "Tipo di Itinerario" → "Cultura" (key: `rating_cultura`)
- Aggiungere Textarea "Prenota per visite e cibo" (`info_prenotazioni`)
- Rimuovere campo "Immagine Copertina"

