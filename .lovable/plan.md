

## Problema

Quando apri la PWA, per qualche secondo vedi il testo di fallback **"Esplora gli itinerari di Pipo"** prima che arrivi il contenuto dal database (**"Una piattaforma per perdersi senza perdere la giornata"**).

Questo succede perché nel codice della Hero Section, il titolo e il sottotitolo hanno un controllo `isLoadingHeadline` che mostra stringa vuota durante il caricamento, ma il testo CTA (`exploreCta`) **non ha questo controllo** e mostra subito il fallback statico.

## Soluzione

Applicare la stessa logica di loading a **tutti i testi della Hero** (headline, subtitle, CTA): mostrare stringa vuota finche i dati dal database non sono pronti, evitando il flash del testo di fallback.

### File da modificare

**`src/components/HeroSection.tsx`** -- aggiungere check `isLoading` anche per subtitle e CTA:
- Usare `isLoadingHeadline` (o i rispettivi `isLoading` di ogni query) per tutti e tre i testi
- Se ancora in caricamento, mostrare stringa vuota invece del fallback `t("exploreCta")`

Modifica minima, una riga:
```
// Da:
const exploreCta = translatedExploreCta || t("exploreCta");

// A:
const exploreCta = isLoadingHeadline ? "" : (translatedExploreCta || t("exploreCta"));
```

Stesso pattern gia usato per `headline` e `subtitle`. Nessuna modifica al database.

