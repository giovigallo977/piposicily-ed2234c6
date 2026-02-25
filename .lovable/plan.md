

# Piano: Fix Premium Status — Dati + Bug verify-payment

## Problema

L'utente ha pagato su Stripe ma il profilo nel database mostra `is_premium: false`, `premium_since: null`, `stripe_session_id: null`. Questo perché:

1. La funzione `complete-purchase` non è mai stata eseguita (0 log) — il flusso post-pagamento si è interrotto
2. La funzione `verify-payment` (fallback) ha un bug: cerca `stripe.customers.list({ email })` ma per pagamenti anonimi Stripe potrebbe non creare un customer object, quindi la verifica restituisce sempre `false`

## Correzioni

### 1. Fix immediato: aggiornare il profilo dell'utente nel database

Eseguire una migration SQL per settare `is_premium = true` per l'utente `alessandro.borzi94@gmail.com` che ha già pagato.

```sql
UPDATE profiles
SET is_premium = true, premium_since = now()
WHERE email = 'alessandro.borzi94@gmail.com';
```

### 2. Fix strutturale: correggere verify-payment

La funzione attualmente:
1. Cerca un customer Stripe per email → se non trova, restituisce `false`
2. Lista le checkout sessions per quel customer

Il problema: per pagamenti anonimi (senza account Stripe preesistente), il customer potrebbe non esistere.

**Fix**: cercare direttamente le checkout sessions per email usando `stripe.checkout.sessions.list()` con filtro email, oppure usare `stripe.customers.list` E anche `stripe.checkout.sessions.list({ customer_details: { email } })`.

Approccio scelto: usare `stripe.checkout.sessions.list()` e filtrare per `customer_details.email` o `customer_email` nel risultato, dato che l'API Stripe permette di cercare sessions anche senza customer ID.

```typescript
// Invece di cercare solo per customer:
// 1. Prima prova con customers.list (utenti con account Stripe)
// 2. Se non trova, cerca tutte le checkout sessions recenti e filtra per email
const sessions = await stripe.checkout.sessions.list({ limit: 100 });
const paid = sessions.data.some(s =>
  s.payment_status === "paid" &&
  s.mode === "payment" &&
  (s.customer_details?.email === user.email || s.customer_email === user.email)
);
```

### 3. Invalidazione cache dopo login nel LoginModal

Il LoginModal attualmente invalida `premium-status` dopo login, ma con un `setTimeout(600ms)` che potrebbe non essere sufficiente. Migliorare facendo un `await` sulla invalidazione e forzando un refetch.

## File da modificare

| File | Azione |
|------|--------|
| Migration SQL | Fix dati utente `is_premium = true` |
| `supabase/functions/verify-payment/index.ts` | Cercare sessions per email, non solo per customer |
| `src/components/LoginModal.tsx` | Rimuovere setTimeout, fare invalidazione diretta |

## Risultato atteso

- L'utente `alessandro.borzi94@gmail.com` vedrà immediatamente tutti gli hotspot sbloccati
- Futuri utenti che pagano ma il cui `complete-purchase` fallisce verranno recuperati dal `verify-payment` corretto
- Il login aggiorna immediatamente lo stato premium senza delay

