

# Piano: Forzare aggiornamento reale per PWA, bookmark e scorciatoie

## Il problema reale

I meta tag anti-cache che abbiamo aggiunto non bastano. Il **service worker** intercetta le richieste **prima** che arrivino al browser, quindi i meta tag vengono ignorati. Quando apri l'app da bookmark o PWA installata:

1. Il vecchio service worker serve l'HTML e gli asset dalla sua cache interna (precache)
2. Solo **dopo** il caricamento controlla se c'è un aggiornamento
3. L'aggiornamento si applica al **prossimo** avvio, non a quello corrente

Risultato: vedi sempre la versione precedente, non quella appena pubblicata.

## Soluzione

Aggiungere una regola di **runtime caching** per le pagine HTML con strategia `NetworkFirst`. Questo forza il service worker a chiedere sempre prima al server la versione più recente dell'HTML, usando la cache solo come fallback offline.

### File: `vite.config.ts`

Aggiungere nella sezione `workbox.runtimeCaching` una regola per i documenti di navigazione (HTML):

```typescript
{
  urlPattern: ({ request }) => request.mode === 'navigate',
  handler: 'NetworkFirst',
  options: {
    cacheName: 'html-cache',
    expiration: {
      maxEntries: 10,
      maxAgeSeconds: 60 * 60, // 1 ora max
    },
    networkTimeoutSeconds: 3, // dopo 3s usa cache (offline)
  },
}
```

Questo garantisce che:
- **Online**: l'HTML viene sempre scaricato dal server (versione aggiornata)
- **Offline**: si usa la cache come fallback (l'app continua a funzionare)
- **PWA installata, bookmark, scorciatoia**: tutti vedono la versione più recente

### Nessun altro file modificato

Il `pwa-updater.ts` e i meta tag in `index.html` restano come sono (sono complementari ma non sufficienti da soli).

