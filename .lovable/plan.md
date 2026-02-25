

# Piano: Fix Free Spots + Aggiornamento automatico Chrome

## Problema 1: Free Spots mostra le Collezioni

Ho trovato la causa. In `src/components/HeroSection.tsx` (linea 192), il pulsante "Free Spots" nella homepage naviga a `/collezioni`:

```text
onClick={() => navigate("/collezioni"))
```

La pagina `/collezioni` (CollectionsPage) mostra prima la griglia delle collezioni, e poi sotto i free spots (solo se ce ne sono). Siccome i free spots sono vuoti (non ne hai ancora creati), vedi solo le collezioni.

### Soluzione
Creare una pagina dedicata `/free-spots` che mostri solo i free spots (con filtri per categoria), separata completamente dalle collezioni. Il pulsante "Free Spots" in homepage navigherà a `/free-spots` invece di `/collezioni`.

File da modificare/creare:
1. **Nuovo file `src/pages/FreeSpotsPage.tsx`** -- pagina dedicata con header, filtri chip (Tutti/Lavorare/Studiare/Eat & Drink) e lista HotspotCard. Nessuna collezione visibile.
2. **`src/components/HeroSection.tsx`** -- cambiare `navigate("/collezioni")` in `navigate("/free-spots")` sul pulsante Free Spots.
3. **`src/App.tsx`** -- aggiungere la route `/free-spots`.
4. **`src/pages/CollectionsPage.tsx`** -- rimuovere tutta la sezione Free Spots (righe 81-128), lasciando solo le collezioni.

---

## Problema 2: Chrome non si aggiorna senza svuotare la cache

Su Safari funziona perche hai pulito i dati del sito. Su Chrome il vecchio Service Worker e ancora attivo e serve la vecchia `index.html` dal precache.

Il sistema attuale (polling 30s + skipWaiting + controllerchange reload) dovrebbe auto-guarire: dopo ~30 secondi il vecchio SW scarica il nuovo SW, che si attiva con skipWaiting, e il reload avviene automaticamente.

Il problema e che il vecchio SW potrebbe non eseguire nemmeno il `reg.update()` se il vecchio codice non lo contiene.

### Soluzione: Cache-busting diretto nell'HTML
Aggiungere un meccanismo di version check che funziona **indipendentemente** dal Service Worker. Al caricamento della pagina, un piccolo script inline in `index.html` fa un fetch a un file versionato e se la versione non corrisponde, de-registra il SW e forza un hard reload.

File da modificare:
1. **`index.html`** -- aggiungere uno script inline che de-registra i vecchi SW e forza il reload. Questo script viene eseguito anche se il SW serve HTML vecchio, perche la prossima volta che il browser fa byte-check del SW e lo trova diverso, lo aggiorna.

In alternativa, l'approccio piu semplice e pratico:
- **Per questa volta**: svuotare la cache di Chrome una sola volta (o aprire in incognito).
- **Per il futuro**: il fix `navigateFallbackDenylist: [/./]` gia in produzione impedira che il problema si ripresenti, perche `NetworkFirst` scarichera sempre HTML fresco.

### Approccio consigliato
Dato che il fix strutturale e gia attivo, il problema su Chrome si risolve con un singolo hard refresh (`Ctrl+Shift+R` su desktop, o "Cancella dati siti web" su mobile). Dopo quel reset una tantum, il nuovo SW si installa e il problema non si ripresentera piu.

---

## Dettagli tecnici

### FreeSpotsPage.tsx
- Header con freccia indietro e titolo "Free Spots"
- Filtri chip: Tutti, Lavorare, Studiare, Eat & Drink
- Lista di HotspotCard con `locked={false}`
- Messaggio vuoto quando non ci sono spot nella categoria selezionata
- Messaggio diverso quando non ci sono spot in assoluto ("Nessun free spot ancora.")

### Perche Chrome non si aggiorna da solo
Il vecchio SW (gia installato) ha una `NavigationRoute` che serve `index.html` dal precache. Anche se il codice `pwa-updater.ts` fa polling ogni 30s, il browser potrebbe non fare il byte-check del SW se lo ha gia controllato di recente (Chrome ha un limite di 24h ma puo variare). Il fix `navigateFallbackDenylist` e nel codice sorgente ma non e ancora nel SW installato su quel browser.

### Ordine di esecuzione
1. Creare `FreeSpotsPage.tsx`
2. Aggiornare `App.tsx` con nuova route
3. Aggiornare `HeroSection.tsx` (navigazione)
4. Pulire `CollectionsPage.tsx` (rimuovere sezione free spots)
5. Pubblicare
6. Su Chrome: fare un hard refresh una tantum

