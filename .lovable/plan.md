

# Piano: Pagamento Prima, Account Dopo

## Problema attuale
Il flusso attuale richiede registrazione (email + password) PRIMA del pagamento. Questo crea frizione e abbandono. L'utente vuole il contrario: **prima paghi su Stripe, poi l'account viene creato automaticamente**.

## Nuovo flusso UX

```text
Utente anonimo naviga l'app
        │
        ▼
Clicca hotspot bloccato
        │
        ▼
Modal semplice: "Sblocca tutto – €4.99"
        │
        ▼
Redirect a Stripe Checkout (inserisce email + paga)
        │
        ▼
Stripe reindirizza a /payment-success?session_id=xxx
        │
        ▼
Pagina chiede di creare una password
        │
        ▼
Edge function: verifica pagamento, crea account, segna premium
        │
        ▼
Auto-login → tutto sbloccato
```

Per utenti che tornano: pulsante "Login" in alto a destra.

---

## Modifiche dettagliate

### 1. PremiumModal.tsx — Semplificazione radicale

Rimuovere le viste "signup" e "choice" con form email/password. Il modal diventa:

**Se utente NON autenticato:**
- Titolo: "Sblocca tutti gli hotspot"
- Testo: "Accesso completo a tutte le mappe Pipo. Pagamento unico 4,99€ – accesso per sempre."
- Benefici (lista con check)
- Prezzo grosso: €4.99 una tantum
- **Pulsante principale**: "Sblocca tutto – €4.99" → chiama `create-payment` (senza auth) → redirect a Stripe
- **Link secondario**: "Hai gia pagato? Accedi" → mostra form login (email + password)

**Se utente autenticato ma non premium:**
- Stesso layout, pulsante "Sblocca tutto – €4.99" con auth

**Se utente autenticato e premium:**
- Non dovrebbe mai apparire

Niente piu form di registrazione nel modal. La registrazione avviene DOPO il pagamento.

### 2. Edge function: create-payment — Rimuovere obbligo auth

File: `supabase/functions/create-payment/index.ts`

- Aggiungere `verify_jwt = false` nella config
- Se l'utente e autenticato (header Authorization presente), usare la sua email
- Se NON autenticato, creare la sessione Stripe senza email prefissata (Stripe la chiede nel checkout)
- Aggiungere `{CHECKOUT_SESSION_ID}` alla success_url: `/payment-success?session_id={CHECKOUT_SESSION_ID}`

### 3. Nuova edge function: complete-purchase

File: `supabase/functions/complete-purchase/index.ts`

Questa funzione:
1. Riceve `session_id` e `password` dal frontend
2. Verifica il pagamento con Stripe (session.payment_status === "paid")
3. Recupera l'email del cliente dalla sessione Stripe
4. Crea l'account utente via `supabaseAdmin.auth.admin.createUser({ email, password, email_confirm: true })`
5. Se l'utente esiste gia (ha pagato prima), aggiorna solo lo stato premium
6. Inserisce/aggiorna il profilo con `is_premium = true`
7. Restituisce `{ success: true, email }` al frontend
8. Il frontend fa `signIn(email, password)` per auto-login

verify_jwt = false (l'utente non ha ancora un account).

### 4. PaymentSuccess.tsx — Pagina "Crea la tua password"

Dopo il redirect da Stripe, la pagina:
1. Mostra "Pagamento completato!" con icona di successo
2. Chiede di creare una password (2 campi: password + conferma)
3. Al submit, chiama `complete-purchase` con session_id e password
4. Dopo la risposta, fa `signIn(email, password)` per auto-login
5. Invalida le query premium-status
6. Reindirizza a `/esplora`

Se l'utente e gia autenticato (caso raro), salta la creazione password e verifica direttamente con `verify-payment`.

### 5. config.toml — JWT config per le nuove funzioni

Aggiungere:
```toml
[functions.create-payment]
verify_jwt = false

[functions.complete-purchase]
verify_jwt = false
```

### 6. Login separato dal Premium Modal

Il form di login (per utenti che hanno gia pagato) resta nel PremiumModal come vista secondaria. Cliccando "Hai gia pagato? Accedi" si mostra il form email+password. Dopo il login, si verifica lo stato premium e si chiude il modal.

### 7. Nessuna modifica a

- Header Login/Logout: resta come implementato
- HotspotCard: resta come implementato (lucchetto + blur)
- usePremiumStatus: resta come implementato
- verify-payment: resta come backup per utenti gia autenticati

---

## File da modificare/creare

| File | Azione |
|------|--------|
| `src/components/PremiumModal.tsx` | Semplificare: rimuovere vista signup, tenere solo "Sblocca tutto" + "Hai gia pagato? Accedi" |
| `supabase/functions/create-payment/index.ts` | Rendere funzionante senza auth, aggiungere session_id alla success_url |
| `supabase/functions/complete-purchase/index.ts` | **Nuovo** — verifica pagamento, crea account, segna premium |
| `src/pages/PaymentSuccess.tsx` | Riprogettare: form password + auto-login dopo pagamento |
| `supabase/config.toml` | Aggiungere verify_jwt = false per create-payment e complete-purchase |

## Sicurezza

- `complete-purchase` verifica SEMPRE il pagamento con Stripe prima di creare l'account
- Il session_id e un token one-time di Stripe, non riutilizzabile per creare account multipli
- Se il pagamento non risulta "paid", la funzione rifiuta la richiesta
- Password scelta dall'utente, non generata automaticamente

