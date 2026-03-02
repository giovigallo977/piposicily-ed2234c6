

## Piano: Mostrare hotspot "Free Spots" nella pagina Free Spots

### Situazione attuale
- La pagina Free Spots (`/free-spots`) legge SOLO dalla tabella `free_spots`
- Gli hotspot con categoria "Free Spots" nella tabella `hotspots` non vengono mostrati in quella pagina
- Le altre categorie (Luoghi Fantasma, Natura, ecc.) funzionano perche la pagina Esplora filtra dalla tabella `hotspots` per categoria

### Modifica

**`src/hooks/useFreeSpots.ts`** — Nel hook `useFreeSpots`, aggiungere una query parallela alla tabella `hotspots` filtrata per `categoria = "Free Spots"`, e unire i risultati con quelli della tabella `free_spots`, ordinando tutto per `ordine`.

In pratica:
1. Fetch da `free_spots` (come ora)
2. Fetch da `hotspots` dove `categoria = 'Free Spots'`
3. Merge dei due array, ordinati per `ordine`
4. Ritornare il risultato combinato

Nessuna modifica necessaria a `FreeSpotsPage.tsx` perche gia usa il tipo `Hotspot` per il rendering (`spot as unknown as Hotspot`).

