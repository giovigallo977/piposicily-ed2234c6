

# Piano: Miglioramento UX del PremiumModal

## Analisi dello stato attuale

Il sistema è **già funzionante** per la maggior parte dei requisiti:
- Navigazione libera senza registrazione
- Icona Login in alto a destra (ExplorePage, CollectionsPage, CollectionDetailPage)
- 1 hotspot gratuito per categoria/collezione, altri bloccati con blur + lucchetto
- PremiumModal con login di default e verifica premium post-login
- Stripe checkout €4.99 one-time
- Pagina /payment-success con verifica automatica
- Edge functions create-payment e verify-payment funzionanti

## Cosa manca / da migliorare

Il modal attuale mostra un singolo form che alterna tra Login e Signup tramite un link di testo in basso. L'utente chiede un'esperienza più chiara con **due opzioni visivamente distinte** e un campo "conferma password" nella registrazione.

## Modifiche previste

### File: `src/components/PremiumModal.tsx`

**Ristrutturare il modal in 3 viste:**

1. **Vista iniziale (scelta)**: Due bottoni chiari
   - "Già registrato? Accedi" → porta alla vista Login
   - "Sblocca tutto — €4.99" → porta alla vista Signup+Pay

2. **Vista Login**: Form email + password, bottone "Accedi"
   - Dopo login: verifica premium → se già premium chiude il modal, altrimenti mostra bottone "Paga €4.99"
   - Link "← Torna indietro" per tornare alla vista scelta

3. **Vista Signup+Pay**: Form email + password + conferma password, bottone "Crea account e paga €4.99"
   - Dopo signup riuscito: mostra toast "Controlla email per conferma"
   - Link "← Torna indietro" per tornare alla vista scelta

**Flusso visuale:**

```text
┌──────────────────────────────┐
│    ✨ Sblocca Pipo Premium   │
│                              │
│  ✓ Tutte le schede sbloccate │
│  ✓ Paghi una volta sola      │
│  ✓ Aggiornamenti inclusi     │
│                              │
│     ┌──── €4.99 ────┐       │
│     │   una tantum   │       │
│     └────────────────┘       │
│                              │
│  ┌────────────────────────┐  │
│  │ Già registrato? Accedi │  │  ← bottone outline
│  └────────────────────────┘  │
│  ┌────────────────────────┐  │
│  │ Sblocca tutto — €4.99  │  │  ← bottone primary
│  └────────────────────────┘  │
│                              │
│  (se user già loggato:       │
│   mostra solo "Paga €4.99") │
└──────────────────────────────┘
```

### Dettagli tecnici

- Nuovo state `view: "choice" | "login" | "signup"` al posto di `isLogin: boolean`
- Campo `confirmPassword` aggiunto per la vista signup con validazione match
- Se l'utente è già autenticato (`user` presente), skip direttamente alla vista pagamento (bottone "Paga €4.99")
- Reset della vista a "choice" quando il modal si chiude
- Nessuna modifica a edge functions, database o altre pagine

### File coinvolti

Solo **`src/components/PremiumModal.tsx`** — tutte le altre pagine e componenti restano invariati.

