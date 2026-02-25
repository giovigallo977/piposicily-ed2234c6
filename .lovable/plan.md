

# Piano: Fix definitivo NavigationRoute nel Service Worker

## Problema confermato
Ho verificato il service worker pubblicato su `piposicily.lovable.app/sw.js`. Contiene ancora due route:
1. `NavigationRoute` con `createHandlerBoundToURL("index.html")` -- serve HTML dal precache
2. `NetworkFirst` per `request.mode === 'navigate'` -- mai raggiunta

`navigateFallback: undefined` non funziona: il plugin vite-plugin-pwa ignora `undefined` e genera comunque la NavigationRoute con `index.html` come default.

## Soluzione
Usare `navigateFallbackDenylist: [/./]` (regex che matcha tutto) per rendere la NavigationRoute inefficace su qualsiasi URL. In questo modo la NavigationRoute esiste nel codice ma non matcha mai, e tutte le navigazioni cadono sulla route `NetworkFirst`.

## File da modificare

### 1. `vite.config.ts`
- Cambiare `navigateFallbackDenylist` da `[/^\/~oauth/]` a `[/./]`
- Questo fa si che la NavigationRoute (che il plugin genera comunque) non matchi nessun URL
- La route `NetworkFirst` diventa l'unico handler effettivo per le navigazioni

### 2. `.knowledge/structure/pwa-auto-update.md`
- Aggiornare la documentazione con la soluzione corretta (`navigateFallbackDenylist: [/./]` invece di `navigateFallback: undefined`)

## Dettagli tecnici

La NavigationRoute di Workbox usa `denylist` per escludere URL. Con `[/./]` (matcha qualsiasi stringa con almeno un carattere), la route non intercetta mai nessuna navigazione. Il risultato e che solo la route runtime `NetworkFirst` gestisce le navigazioni, scaricando HTML fresco dal server.

Perche `navigateFallback: undefined` non funzionava:
- vite-plugin-pwa internamente usa `index.html` come default quando il valore e `undefined`/non impostato
- Non esiste un modo documentato per impedire la generazione della NavigationRoute con `generateSW`
- La denylist totale e l'unico approccio affidabile senza passare a `injectManifest`

## Dopo la pubblicazione
Sul dispositivo iOS:
1. Impostazioni Safari > Avanzate > Dati dei siti web > Elimina dati per piposicily.lovable.app
2. Se PWA installata: rimuovere da Home Screen e reinstallare
3. Questo e un reset una tantum necessario perche il vecchio SW con la NavigationRoute attiva e gia installato

