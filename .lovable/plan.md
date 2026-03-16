
Obiettivo: fare in modo che l’ordinamento degli hotspot dentro ogni collezione (Palermo Liberty inclusa) funzioni come nelle categorie Hotspots: click su freccia su/giù = salvataggio immediato e aggiornamento automatico della web app.

1) Diagnosi tecnica (già verificata)
- Nelle categorie normali, le frecce aggiornano subito `hotspots.ordine` (senza pulsante salva).
- Nelle collezioni, oggi l’ordine dipende da `selectedHotspotIds` nel dialog e viene scritto solo al submit (`useSyncCollectionHotspots`), quindi non è “live”.
- Inoltre `collection_hotspots` non è in realtime publication, quindi l’app pubblica non riceve aggiornamento istantaneo come per `hotspots`.

2) Modifiche da implementare
- File: `src/hooks/useCollections.ts`
  - Aggiungere una mutation dedicata al riordino rapido (swap di due righe in `collection_hotspots`) simile a `useReorderHotspots`.
  - Aggiungere realtime subscription singleton per:
    - tabella `collections`
    - tabella `collection_hotspots`
  - Invalidare query React Query:
    - `["collections"]`
    - `["collection_hotspots"]`
    - `["hotspot_collections"]` (quando utile)

- File: `src/components/AdminCollectionsTab.tsx`
  - Nel dialog di modifica collezione, aggiungere una sezione “Ordina hotspot della collezione” con lista degli hotspot selezionati.
  - Ogni riga avrà frecce su/giù.
  - Click freccia:
    1) aggiorna subito il backend (mutation reorder),
    2) aggiorna subito lo stato locale,
    3) disabilita temporaneamente i bottoni durante pending.
  - Lasciare il pulsante “Salva Modifiche” per i metadati collezione (nome/descrizione/immagine), non più necessario per il solo riordino.

3) Aggiornamento backend (migrazione)
- Aggiungere realtime publication per:
  - `public.collections`
  - `public.collection_hotspots`
- Nessuna modifica RLS necessaria (le policy già consentono SELECT pubblico e write agli autenticati).

4) Risultato atteso per il tuo caso
- In Admin > Collezioni > Palermo Liberty:
  - sposti “Giardino Inglese” su/giù con frecce,
  - il nuovo ordine viene salvato immediatamente,
  - la pagina collezione nella web app si riallinea automaticamente (senza dover fare “Salva” del form ordine).

5) Verifica end-to-end
- Test 1: sposta un hotspot in Palermo Liberty e verifica che, riaprendo subito la stessa collezione, l’ordine persista.
- Test 2: tieni aperta la pagina pubblica della collezione in un’altra tab e verifica aggiornamento automatico dopo click su frecce.
- Test 3: verifica che creazione/modifica collezione (nome, immagine, descrizione) continui a funzionare senza regressioni.
