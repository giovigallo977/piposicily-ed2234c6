

# Piano: Sincronizzazione Realtime degli Hotspots

## Problema Identificato

Gli hotspot modificati dal backend non appaiono sulla piattaforma perche:

1. **Nessuna subscription realtime sulla tabella `hotspots`**: il hook `useHotspots` usa solo React Query con cache statica. Quando aggiungi/modifichi hotspot dal backend, il frontend non sa che deve ricaricare i dati.
2. **La tabella `hotspots` potrebbe non essere nella pubblicazione realtime**: serve verificare e aggiungere `hotspots` alla pubblicazione `supabase_realtime`.

## Soluzione

### 1. Migrazione Database
Aggiungere la tabella `hotspots` alla pubblicazione realtime (se non gia presente):

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE public.hotspots;
```

### 2. Modifica `src/hooks/useHotspots.tsx`
Aggiungere una subscription realtime che invalida la cache React Query quando arrivano cambiamenti. Pattern identico a quello gia usato in `useSiteContent.ts`:

- Singleton globale che ascolta `postgres_changes` su `public.hotspots`
- Su ogni evento (`INSERT`, `UPDATE`, `DELETE`), chiama `queryClient.invalidateQueries({ queryKey: ["hotspots"] })`
- `useEffect` nel hook `useHotspots` per inizializzare la subscription

Risultato: ogni modifica fatta dal pannello admin o direttamente dal backend si riflette immediatamente su tutti i client connessi, senza refresh.

### File Modificati
- `supabase/migrations/` -- nuova migrazione per pubblicazione realtime
- `src/hooks/useHotspots.tsx` -- aggiunta subscription realtime

