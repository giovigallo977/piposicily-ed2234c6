

## Aggiungere navigazione "Indietro" alle landing page

### Problema
Dalle pagine `/self-guided` e `/experience` non c'è modo di tornare alla homepage `/`. L'utente resta bloccato.

### Soluzione
Aggiungere un link "← Torna alla scelta" in cima a entrambe le landing, accanto al logo Pipo. Stessa cosa: rendere il logo Pipo cliccabile su tutte e 3 le pagine (homepage, self-guided, experience) per tornare sempre a `/`.

### File modificati

**`src/pages/SelfGuidedLanding.tsx`** e **`src/pages/ExperienceLanding.tsx`**
- Importare `Link` da `react-router-dom`
- Rendere il logo "Pipo" un link a `/`
- Aggiungere sotto il logo un link testuale "← Torna alla scelta" che riporta a `/`

**`src/pages/Index.tsx`**
- Nessuna modifica necessaria (è già la homepage)

### Dettaglio UI

```text
┌──────────────────────────┐
│ Pipo (link → /)          │
│ ← Torna alla scelta      │
│                          │
│ [resto della landing]    │
└──────────────────────────┘
```

