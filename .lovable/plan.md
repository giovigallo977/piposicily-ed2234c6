

# Aggiungere selezione Collezioni nel form Hotspot

## Obiettivo
Quando crei o modifichi un hotspot dal pannello Admin, potrai anche selezionare a quali collezioni appartiene direttamente dal form.

## Cosa cambia

### 1. Form Hotspot (Admin.tsx)
- Aggiunta di una sezione "Collezioni" nel dialog di creazione/modifica hotspot
- Lista di checkbox con tutte le collezioni disponibili (come gia fatto nel form collezioni per gli hotspot)
- Quando salvi l'hotspot, le associazioni nella tabella `collection_hotspots` vengono aggiornate automaticamente

### 2. Logica di sincronizzazione
- Al caricamento del form in modifica, vengono lette le collezioni attualmente associate all'hotspot
- Al salvataggio, le associazioni vengono sincronizzate: rimosse quelle deselezionate, aggiunte quelle nuove

## Dettagli tecnici

### Nuovo hook: query collezioni per hotspot
- In `useCollections.ts`, aggiungere `useHotspotCollections(hotspotId)` che legge dalla tabella `collection_hotspots` filtrando per `hotspot_id`

### Nuovo hook: sync collezioni per hotspot  
- `useSyncHotspotCollections()` che cancella le associazioni esistenti per un hotspot e le ricrea con le nuove selezioni

### Modifiche a `Admin.tsx`
- Importare `useCollections`, `useHotspotCollections`, `useSyncHotspotCollections`
- Aggiungere stato `selectedCollectionIds: string[]`
- Nel form, dopo la sezione tags, inserire la lista di collezioni con checkbox
- Nel `handleSubmit`, dopo il salvataggio dell'hotspot, chiamare `syncHotspotCollections`
- Nel `handleOpenEdit`, caricare le collezioni associate

### Nessuna modifica al database
Le tabelle `collections` e `collection_hotspots` esistono gia con la struttura necessaria.

