# PWA Auto-Update Strategy

L'app è una PWA con un sistema multi-livello per garantire che bookmark, scorciatoie e PWA installata mostrino sempre la versione più recente:

## 1. Service Worker (vite.config.ts)

- `skipWaiting: true` e `clientsClaim: true` per attivazione immediata del nuovo SW
- `cleanupOutdatedCaches: true` per rimuovere cache obsolete
- **`navigateFallback: undefined`** — CRITICO: disabilita la `NavigationRoute` precache di Workbox che altrimenti intercetterebbe tutte le navigazioni prima della route `NetworkFirst`, servendo HTML vecchio dal precache.
- `navigateFallbackDenylist: [/^\/~oauth/]` per escludere OAuth dal fallback
- **Runtime caching NetworkFirst per HTML**: tutte le richieste di navigazione (`request.mode === 'navigate'`) usano strategia `NetworkFirst` con timeout 3s e cache `html-cache`. Questo forza il download dell'HTML fresco dal server quando online, usando la cache solo come fallback offline.
- Runtime caching `NetworkFirst` per API Supabase (cache 5 min)
- Runtime caching `CacheFirst` per immagini (cache 7 giorni)

### Root cause fix (febbraio 2026)
Il problema "app non si aggiorna mai su iOS" era causato dalla priorità delle route nel SW generato da Workbox:
1. Workbox generava una `NavigationRoute` (precache fallback) che matchava tutte le navigazioni
2. La route `NetworkFirst` runtime veniva registrata dopo, ma non veniva mai raggiunta
3. Soluzione: `navigateFallback: undefined` elimina la NavigationRoute, lasciando il `NetworkFirst` come unico handler per le navigazioni

## 2. Meta tag anti-cache (index.html)

- `Cache-Control: no-cache, no-store, must-revalidate`
- `Pragma: no-cache`
- `Expires: 0`
- Impediscono al browser di servire HTML vecchio dalla cache HTTP

## 3. PWA Updater (src/pwa-updater.ts)

- Check immediato `reg.update()` all'apertura dell'app (non solo periodico)
- Polling ogni 30 secondi per aggiornamenti SW
- `SKIP_WAITING` automatico quando un nuovo SW è in attesa
- Reload automatico su `controllerchange`
- Check su `visibilitychange` (ritorno alla tab/app)
- Check su `focus` (switching tab desktop)
- **Check su `pageshow`** — specifico per iOS standalone/bookmark: fires reliably quando l'utente ritorna alla PWA. Se `event.persisted` (bfcache), forza reload.
