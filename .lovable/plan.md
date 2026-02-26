

## Verifica dei 3 punti critici

### 1. complete-purchase: crea utente + premium ✅ OK (con 1 rischio)

Il flusso e' corretto: cerca utente → crea se non esiste → update `is_premium = true`.

**Rischio**: la lista utenti usa `per_page=50`. Se hai piu' di 50 utenti, potrebbe non trovare un utente esistente e tentare di crearlo di nuovo (fallendo con errore "user already exists"). Fix: aumentare a `per_page=1000` o meglio filtrare per email.

### 2. Magic link: potrebbe NON arrivare ⚠️ Problema

Il call OTP manca del parametro `email_redirect_to`. Senza questo, il magic link potrebbe reindirizzare a un URL di default di Supabase invece che alla tua app. Inoltre, senza un dominio email custom, le email partono da un indirizzo generico e possono finire in spam.

### 3. Sessione persistente ✅ OK

`client.ts` ha gia' `persistSession: true` e `autoRefreshToken: true`. La sessione sopravvive a refresh e chiusura browser. La durata dipende dal JWT expiry configurato nel backend (default Supabase: 1 ora token + refresh automatico).

---

## Fix da implementare

### File: `supabase/functions/complete-purchase/index.ts`

**Fix 1** — Linea 51: Cambiare `per_page=50` a `per_page=1000` per evitare di non trovare utenti esistenti.

**Fix 2** — Linea 104-110: Aggiungere `email_redirect_to` nel body dell'OTP per garantire che il magic link porti l'utente alla tua app:

```typescript
body: JSON.stringify({
  email,
  create_user: false,
  gotrue_meta_security: {},
  code_challenge: null,
  code_challenge_method: null,
  email_redirect_to: origin,
}),
```

### File: `src/pages/PaymentSuccess.tsx`

**Fix 3** — Nel flusso principale (linea 85-90): se `complete-purchase` fallisce, non mostrare subito errore ma mostrare comunque il messaggio "controlla email" con il pulsante "invia di nuovo" (perche' l'utente e il premium potrebbero essere gia' stati creati nonostante l'errore nell'invio OTP).

### Nessun altro file da modificare.

