

## Piano: Pulizia codice, rimozione duplicati e ottimizzazione

### Problemi trovati

1. **`DECO_KEYS` inutilizzato** in `HeroSection.tsx` (riga 12-17) — costante definita ma mai usata
2. **`useFreeSpotCategories.ts` orfano** — hook mai importato da nessun componente, codice morto
3. **20+ `useEffect` duplicati in `Admin.tsx`** (righe 102-184) — ogni campo site_content ha un `useEffect` separato per sincronizzare stato locale. Possono essere consolidati in un unico `useEffect`
4. **Righe vuote superflue** in `Admin.tsx` (righe 116-117, 130-131, 138, 288, 933, 999-1001) — spazi vuoti senza scopo
5. **`useFreeSpots` query duplicata** — Il hook fa 2 query parallele (tabella `free_spots` + tabella `hotspots` filtrata per "Free Spots"). Questo e corretto per il funzionamento ma i dati dalla tabella `free_spots` vengono anche mostrati nel tab admin `AdminFreeSpotsTab`, che gestisce una tabella separata. Non e un bug, ma va tenuto presente
6. **`(supabase as any)`** in `useFreeSpotCategories.ts` — cast non necessario dato che il tipo esiste gia in `types.ts`

### Modifiche previste

**`src/components/HeroSection.tsx`**
- Rimuovere la costante `DECO_KEYS` inutilizzata (righe 12-17)

**`src/hooks/useFreeSpotCategories.ts`**
- Eliminare il file intero (codice morto, mai usato)

**`src/pages/Admin.tsx`**
- Consolidare i 20 `useEffect` (righe 102-184) in un singolo `useEffect` che sincronizza tutti i valori site_content in un colpo solo
- Rimuovere righe vuote superflue
- Risultato: circa 80 righe in meno

### Nessuna modifica a
- Logica business (free spots, hotspots, premium, auth)
- Database / migrazioni
- Componenti pubblici (HotspotCard, ExplorePage, FreeSpotsPage)

