

## Piano: Auto-redirect dopo attivazione premium

### Problema attuale
Dopo `setCompleted(true)`, l'utente vede una schermata di conferma con un bottone manuale "Inizia ad esplorare". Può anche tornare indietro con il browser e rivedere la pagina di attivazione.

### Modifiche a `src/pages/PaymentSuccess.tsx`

1. **Auto-redirect dopo completamento**: Aggiungere un `useEffect` che, quando `completed` diventa `true`, fa automaticamente `navigate("/", { replace: true })` dopo 2 secondi (tempo sufficiente per vedere il checkmark di conferma). Il `replace: true` impedisce di tornare indietro alla pagina di attivazione.

2. **Forzare refetch premium**: Prima del redirect, chiamare `queryClient.invalidateQueries({ queryKey: ["premium-status"] })` e `queryClient.refetchQueries({ queryKey: ["premium-status"] })` per garantire che lo stato premium sia aggiornato al rientro in homepage.

3. **Usare `replace: true` ovunque**: In tutti i `navigate("/")` esistenti, aggiungere `{ replace: true }` per eliminare `/payment-success` dalla history del browser.

### Flusso risultante
```
setCompleted(true) → schermata checkmark (2s) → auto-redirect a / (replace) → homepage premium
                                                   ↑ back button non torna a payment-success
```

### File da modificare
| File | Azione |
|------|--------|
| `src/pages/PaymentSuccess.tsx` | Aggiungere useEffect auto-redirect + replace: true |

