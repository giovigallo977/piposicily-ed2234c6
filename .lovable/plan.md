
Obiettivo: risolvere in modo definitivo il fatto che su iOS (browser, bookmark e PWA installata) l’app resti alla versione vecchia.

Stato attuale verificato:
- Ho analizzato la configurazione PWA e il service worker pubblicato.
- Nel service worker live sono presenti due route di navigazione:
  1) una `NavigationRoute` che serve `index.html` dal precache
  2) la tua nuova route `NetworkFirst` per `request.mode === "navigate"`
- In Workbox vince la prima route che matcha: quindi la `NavigationRoute` intercetta prima e la `NetworkFirst` di fatto non entra quasi mai.
- Questo spiega perfettamente il sintomo “non cambia mai” anche dopo pubblicazione.

Chiarimenti già raccolti (critici):
- Dove succede: Browser normale + PWA installata + Bookmark
- Dispositivo: iOS
- Comportamento: non cambia mai

Piano di intervento (implementazione):
1) Disattivare l’intercettazione navigazione “precache fallback” che sta bypassando `NetworkFirst`
   - File: `vite.config.ts`
   - Modifica: rendere la `NavigationRoute` non applicabile a tutte le pagine (denylist totale) oppure disabilitarla esplicitamente.
   - Effetto: le navigazioni useranno davvero la route `NetworkFirst` e scaricheranno `index.html` fresco quando online.

2) Mantenere la route `NetworkFirst` per HTML come route primaria
   - File: `vite.config.ts`
   - Confermare:
     - `urlPattern: ({ request }) => request.mode === "navigate"`
     - `handler: "NetworkFirst"`
     - `networkTimeoutSeconds: 3`
     - cache dedicata `html-cache`
   - Effetto: online prende l’HTML nuovo, offline fallback da cache.

3) Rafforzare trigger update su iOS app resume
   - File: `src/pwa-updater.ts`
   - Aggiungere listener `pageshow` (iOS lo usa spesso al ritorno da home screen/standalone).
   - Effetto: quando riapri da icona/bookmark viene fatto `reg.update()` immediato anche nei casi dove `focus/visibilitychange` non sono affidabili.

4) Allineare “DNA memory” reale del progetto
   - File: `.knowledge/structure/pwa-auto-update.md`
   - Confermare che documenta anche questa correzione strutturale (priorità route SW / fallback disattivato).

5) Validazione end-to-end post-fix (obbligatoria)
   - Test matrix:
     - Safari URL diretto
     - Bookmark Safari
     - PWA installata da home screen
   - Per ogni scenario:
     1. pubblicare una modifica visibile (es. testo hero con timestamp)
     2. chiudere e riaprire
     3. verificare che appaia la versione nuova
   - Se una sola superficie resta vecchia: eseguire “one-time recovery” su iOS (rimozione app da home + clear website data + reinstallazione).

Dettagli tecnici (sezione dedicata):
- Root cause tecnico:
  - Non era un problema di meta tag o solo polling.
  - Era un problema di priorità delle route nel SW: precache navigation fallback precedeva `NetworkFirst`.
- Perché iOS soffre di più:
  - lifecycle SW/standalone più aggressivo sulla persistenza cache e aggiornamenti non sempre immediati su resume.
- Criterio di successo:
  - Nuova pubblicazione visibile entro 1 riapertura app in tutte e 3 le modalità (browser, bookmark, PWA).

Rischi e mitigazioni:
- Rischio: togliendo fallback precache potresti cambiare il comportamento offline su primo avvio.
- Mitigazione: `NetworkFirst` con cache HTML già copre il fallback dopo almeno un caricamento online; validare anche scenario offline dopo primo load.

Ordine esecuzione proposto:
1. Patch `vite.config.ts` (route precedence fix)
2. Patch `src/pwa-updater.ts` (`pageshow`)
3. Verifica service worker generato in build
4. Pubblicazione
5. Test E2E iOS (browser/bookmark/PWA)
