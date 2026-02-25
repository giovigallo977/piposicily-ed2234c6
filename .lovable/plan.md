

# Piano: Aggiornare la memoria DNA pwa-auto-update

Il file della memoria DNA va aggiornato per riflettere tutte le configurazioni PWA attualmente in uso.

### File: `.knowledge/structure/backend-sync-principle.md` — Nessuna modifica

### Nuovo/aggiornato: memoria DNA `pwa-auto-update`

Il contenuto aggiornato sarà:

---

**L'app è una PWA con un sistema multi-livello per garantire che bookmark, scorciatoie e PWA installata mostrino sempre la versione più recente:**

1. **Service Worker (vite.config.ts)**
   - `skipWaiting: true` e `clientsClaim: true` per attivazione immediata del nuovo SW
   - `cleanupOutdatedCaches: true` per rimuovere cache obsolete
   - `navigateFallbackDenylist: [/^\/~oauth/]` per escludere OAuth dal fallback
   - **Runtime caching NetworkFirst per HTML**: tutte le richieste di navigazione (`request.mode === 'navigate'`) usano strategia `NetworkFirst` con timeout 3s e cache `html-cache`. Questo forza il download dell'HTML fresco dal server quando online, usando la cache solo come fallback offline.
   - Runtime caching `NetworkFirst` per API Supabase (cache 5 min)
   - Runtime caching `CacheFirst` per immagini (cache 7 giorni)

2. **Meta tag anti-cache (index.html)**
   - `Cache-Control: no-cache, no-store, must-revalidate`
   - `Pragma: no-cache`
   - `Expires: 0`
   - Impediscono al browser di servire HTML vecchio dalla cache HTTP

3. **PWA Updater (src/pwa-updater.ts)**
   - Check immediato `reg.update()` all'apertura dell'app (non solo periodico)
   - Polling ogni 30 secondi per aggiornamenti SW
   - `SKIP_WAITING` automatico quando un nuovo SW è in attesa
   - Reload automatico su `controllerchange`
   - Check su `visibilitychange` (ritorno alla tab/app)
   - Check su `focus` (switching tab desktop)

---

Questo è un singolo file da aggiornare nella memoria del progetto.

