

# Piano: Logica Premium nelle Collezioni

## Problema

La pagina dettaglio collezione (`CollectionDetailPage`) mostra tutte le schede hotspot senza restrizioni. Deve invece seguire la stessa logica della pagina Esplora: solo la **prima scheda** della collezione è gratuita, le altre sono bloccate (blur + lucchetto) per gli utenti non premium.

## Modifiche

**File: `src/pages/CollectionDetailPage.tsx`**

1. Importare `useState` e i componenti necessari: `usePremiumStatus`, `PremiumModal`, `Sparkles`
2. Aggiungere lo stato per il modal premium
3. Aggiungere il banner premium (come in ExplorePage) che mostra "1/N schede disponibili" e il link "Sblocca tutto"
4. Nel rendering delle card, passare `locked={true}` a tutte le card tranne la prima (index 0), e `isFree={true}` alla prima card — solo per utenti non premium
5. Passare `onLockedClick` per aprire il modal premium

### Logica specifica

- La **prima scheda** (index 0) nella collezione è sempre gratuita
- Tutte le altre (index > 0) sono bloccate se l'utente non è premium
- Il banner mostra "1/{totale} schede disponibili" con il pulsante "Sblocca tutto"
- Click su card bloccata o sul banner apre il `PremiumModal`

### Struttura risultante

```text
┌─────────────────────────────┐
│  ← Header (nome collezione) │
├─────────────────────────────┤
│  ✨ 1/6 disponibili  [Sblocca tutto]  │  ← solo non-premium
├─────────────────────────────┤
│  Card 1 (GRATUITO badge)    │  ← visibile
│  Card 2 (🔒 blur)          │  ← bloccata
│  Card 3 (🔒 blur)          │  ← bloccata
│  ...                        │
└─────────────────────────────┘
```

Nessuna modifica al database o ad altri file necessaria.

