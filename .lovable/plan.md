

# Piano: Aggiornamento automatico garantito per bookmark, PWA e scorciatoie

## Problema

Quando apri l'app da un bookmark, una scorciatoia sul telefono, o dalla PWA installata, potresti vedere una versione vecchia perché:

1. Il browser può servire la pagina dalla sua cache HTTP **prima** ancora che il service worker intervenga
2. Il controllo aggiornamenti parte solo dopo 30 secondi, non immediatamente all'apertura
3. Non ci sono istruzioni anti-cache sull'HTML principale (`index.html`)

## Soluzione

Due interventi complementari che coprono tutti gli scenari (bookmark browser, PWA installata, scorciatoia home screen):

### 1. File: `index.html` - Meta tag anti-cache

Aggiungere nel `<head>` meta tag che impediscono al browser di servire una copia vecchia dell'HTML:

```html
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Expires" content="0" />
```

Questo forza il browser a richiedere sempre l'HTML fresco dal server. Gli asset (JS, CSS, immagini) restano cachati normalmente grazie agli hash di Vite.

### 2. File: `src/pwa-updater.ts` - Check immediato all'apertura

Aggiungere un `reg.update()` immediato quando l'app si carica (non solo nel ciclo ogni 30s). Così anche aprendo da bookmark o scorciatoia, il service worker controlla subito se c'è una versione nuova:

```typescript
// Dentro registerPWAUpdater, dopo il check del waiting worker:
navigator.serviceWorker.getRegistration().then(async (reg) => {
  // ... codice esistente per waiting/updatefound ...
  
  // Forza un check immediato all'apertura
  try { await reg?.update(); } catch {}
});
```

### Nessun altro file modificato

La configurazione Workbox (`skipWaiting`, `clientsClaim`, `cleanupOutdatedCaches`) resta invariata. Questi due interventi coprono il gap mancante: il primo impedisce che il browser serva HTML vecchio, il secondo garantisce che il SW verifichi subito gli aggiornamenti.

