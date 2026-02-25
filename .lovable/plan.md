

# Piano: Pulizia e Coerenza Flusso Accesso + Pagamento

## Analisi stato attuale

Dopo aver esaminato il codice, la struttura base e gia corretta:
- Login/Logout in header su tutte le pagine ✅
- PremiumModal con "Sblocca tutto" + "Hai gia pagato? Accedi" ✅
- Flusso payment-first con complete-purchase ✅
- Hotspot locking (primo per categoria gratuito) ✅

## Cosa manca / da correggere

### 1. PaymentSuccess: email precompilata non mostrata

Attualmente la pagina mostra solo i campi password. Il prompt richiede che l'email (da Stripe) sia visibile e non modificabile. Serve:
- Aggiungere un endpoint o modificare `complete-purchase` per poter recuperare l'email dalla sessione Stripe **prima** di inviare la password
- Oppure creare una piccola edge function `get-session-email` che dato il `session_id` restituisce solo l'email
- Mostrare l'email come campo read-only nella pagina

**Approccio scelto**: aggiungere una nuova edge function `get-session-email` (semplice, sicura) che restituisce l'email dal session Stripe. La PaymentSuccess la chiama al mount per precompilare il campo.

### 2. Logout: toast di conferma

Al momento il logout non mostra nessun feedback. Aggiungere un toast "Sei uscito" / "Logged out" su tutte le pagine che hanno il pulsante Logout (MinimalHeader, ExplorePage, CollectionsPage, CollectionDetailPage, FreeSpotsPage).

**Approccio**: creare una funzione `handleSignOut` centralizzata che chiama `signOut()` e poi mostra il toast.

### 3. PremiumModal: guardia "gia premium"

Se un utente premium apre il modal (caso raro), mostrare "Sei gia Premium ✨ — Tutti gli hotspot sono sbloccati" invece del flusso di pagamento.

### 4. config.toml: verify_jwt mancante

Il file `supabase/config.toml` non ha le configurazioni `verify_jwt = false` per `create-payment` e `complete-purchase`. Vanno aggiunte (piu la nuova `get-session-email`).

### 5. PaymentSuccess: redirect alla home dopo successo

Il prompt dice redirect alla home, attualmente va a `/esplora`. Cambiare in `/` con toast "Accesso Premium attivo".

---

## File da modificare/creare

| File | Azione | Dettaglio |
|------|--------|-----------|
| `supabase/functions/get-session-email/index.ts` | **Nuovo** | Riceve `session_id`, restituisce email da Stripe |
| `src/pages/PaymentSuccess.tsx` | Modifica | Aggiungere fetch email al mount, mostrare campo email read-only, redirect a `/` |
| `src/components/PremiumModal.tsx` | Modifica | Aggiungere guardia "gia premium" |
| `src/components/MinimalHeader.tsx` | Modifica | Toast su logout |
| `src/pages/ExplorePage.tsx` | Modifica | Toast su logout |
| `src/pages/CollectionsPage.tsx` | Modifica | Toast su logout |
| `src/pages/CollectionDetailPage.tsx` | Modifica | Toast su logout |
| `src/pages/FreeSpotsPage.tsx` | Modifica | Toast su logout |
| `supabase/config.toml` | Modifica | Aggiungere verify_jwt = false per le 3 edge functions |

---

## Dettagli tecnici

### get-session-email edge function

```typescript
// Riceve { session_id }
// Verifica con Stripe
// Restituisce { email } o errore
```
verify_jwt = false (utente non autenticato dopo pagamento).

### PaymentSuccess — nuovo flusso

1. Al mount, se c'e `session_id`, chiama `get-session-email` per ottenere l'email
2. Mostra email in campo Input disabled
3. Utente inserisce password + conferma
4. Submit chiama `complete-purchase` come ora
5. Dopo successo: toast "Accesso Premium attivo" e redirect a `/`

### Logout toast

In ogni pagina con pulsante Logout, il click chiama:
```typescript
const handleLogout = async () => {
  await signOut();
  toast({ title: language === "it" ? "Sei uscito" : "Logged out" });
};
```

### PremiumModal guardia premium

All'inizio del render, se `isPremium === true`, mostrare messaggio "Sei gia Premium" con pulsante per chiudere il modal. Niente form, niente Stripe.

