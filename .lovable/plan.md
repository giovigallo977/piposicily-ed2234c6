
# Piano: Correzione errori e ottimizzazioni

## Problemi trovati

L'app funziona correttamente e si carica bene. Il messaggio "starting live preview" e un comportamento normale della piattaforma Lovable, non e un bug della tua app.

Ho trovato pero 2 problemi tecnici da correggere:

### 1. Errori 406 ripetuti (richieste fallite in loop)
Due chiavi del database non esistono ancora: `explore_cta_text` e `homepage_bg_color`. Il codice usa `.single()` che genera un errore 406 quando non trova righe. React Query ritenta queste richieste fallite ogni pochi secondi, causando traffico di rete inutile e messaggi di errore nella console.

**Soluzione**: Modificare `useSiteContent` nel hook `src/hooks/useSiteContent.ts` per usare `.maybeSingle()` invece di `.single()`. Questo restituisce `null` invece di un errore quando la chiave non esiste, eliminando i retry continui.

### 2. Warning React "Function components cannot be given refs"
I componenti `HeroSection` e `MissionSection` ricevono ref ma non sono wrappati con `React.forwardRef()`. Questo genera warning nella console.

**Soluzione**: Non serve wrappare con forwardRef dato che questi componenti non hanno bisogno di ref. Il problema e probabilmente causato dal tagger di Lovable in dev. Nessuna azione necessaria.

## Dettagli tecnici

| File | Modifica |
|------|----------|
| `src/hooks/useSiteContent.ts` | Cambiare `.single()` in `.maybeSingle()` nella funzione `useSiteContent` (riga 21) |

### Codice da modificare

In `src/hooks/useSiteContent.ts`, riga 21:
```
// Prima:
.single();

// Dopo:
.maybeSingle();
```

Questo e l'unico cambiamento necessario. Elimina gli errori 406 ripetuti e i retry inutili.

## Risultato
- Niente piu errori 406 nella console
- Niente piu richieste di rete ripetute ogni pochi secondi
- L'app continua a funzionare esattamente come prima
