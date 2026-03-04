

## Piano: Riordinamento hotspot per categoria nell'admin

### Obiettivo
Aggiungere nella tab Hotspot dell'admin la possibilità di riordinare gli hotspot **raggruppati per categoria**, così da controllare quale appare per primo (e quindi gratuito) in ogni categoria.

### Come funziona ora
- Gli hotspot hanno un campo `ordine` globale
- La pagina Esplora determina il primo hotspot gratuito per categoria ordinando per `ordine`
- Nell'admin, la lista hotspot è piatta senza raggruppamento

### Modifiche

**`src/pages/Admin.tsx`** — Nella sezione lista hotspot (riga ~569+):
1. Raggruppare gli hotspot per categoria (usando un `useMemo`)
2. Mostrare ogni gruppo con un header categoria
3. Per ogni gruppo, aggiungere pulsanti freccia su/giù per spostare l'ordine dell'hotspot all'interno della sua categoria
4. Al click delle frecce, aggiornare il campo `ordine` degli hotspot coinvolti tramite `useUpdateHotspot`
5. Il primo hotspot di ogni categoria avrà un badge "FREE" visivo per rendere chiaro quale sarà gratuito

**`src/hooks/useHotspots.tsx`** — Aggiungere un hook `useReorderHotspot` (mutation batch) per aggiornare l'ordine di due hotspot in un colpo solo (swap).

### Dettaglio tecnico
- Raggruppamento: `hotspots.reduce()` per `categoria`
- Riordino: swap dei valori `ordine` tra due hotspot adiacenti nella stessa categoria
- Nessuna modifica al database: il campo `ordine` esiste già
- La logica "primo = free" in `ExplorePage` rimane invariata

