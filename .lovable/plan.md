

# Piano: Login intelligente per utenti Premium

## Problema attuale

Quando un utente ha gia pagato ma non e loggato, cliccando su un hotspot bloccato vede il modal di registrazione/pagamento generico. Non c'e modo rapido per fare login senza passare dal modal premium.

## Modifiche previste

### 1. PremiumModal piu intelligente (`src/components/PremiumModal.tsx`)

- Quando l'utente non e autenticato, mostrare per default la vista **Login** (non Signup), con il messaggio "Hai gia pagato? Effettua l'accesso"
- Cambiare `isLogin` default a `true` invece di `false`
- Dopo il login, verificare lo stato premium: se l'utente e gia premium, chiudere il modal e ricaricare i dati (senza ridirigere a Stripe)
- Solo se non e premium dopo il login, procedere con il pagamento

### 2. Bottone Login nell'header (`src/pages/ExplorePage.tsx` e `src/pages/CollectionDetailPage.tsx`)

- Aggiungere un piccolo bottone login in alto a destra (icona `LogIn`) visibile solo quando l'utente **non e autenticato**
- Click sul bottone apre il PremiumModal (che ora parte dalla vista login)
- Se l'utente e gia autenticato e premium, mostrare il badge "Premium Member" (gia presente in ExplorePage)
- Se autenticato ma non premium, nessun bottone login (il modal si apre dalle card bloccate)

### 3. Flusso post-login nel PremiumModal

```text
Utente clicca card bloccata
        │
        ▼
  PremiumModal si apre
  (default: form Login)
        │
   Utente fa login
        │
        ▼
  Verifica premium status
        │
   ┌────┴────┐
   │         │
Premium   Non Premium
   │         │
   ▼         ▼
Chiudi    Mostra bottone
modal +   "Paga €4.99"
refresh
```

### File modificati

1. **`src/components/PremiumModal.tsx`**
   - Default `isLogin = true`
   - Dopo login: controllare `profiles.is_premium` prima di avviare il pagamento
   - Se gia premium: chiudere modal, invalidare query cache premium-status
   - Testo aggiornato: "Hai gia pagato? Accedi" / "Already paid? Log in"

2. **`src/pages/ExplorePage.tsx`**
   - Aggiungere icona `LogIn` in alto a destra (al posto dello spacer) quando utente non autenticato
   - Click apre PremiumModal

3. **`src/pages/CollectionDetailPage.tsx`**
   - Stesso bottone login in alto a destra quando utente non autenticato

4. **`src/pages/CollectionsPage.tsx`** (se ha un header)
   - Stesso pattern per coerenza

