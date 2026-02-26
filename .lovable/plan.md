

# Piano: Migrazione a Magic Link — Zero Password

## Panoramica

Eliminare completamente le password dal flusso. Dopo il pagamento Stripe, il backend crea l'utente automaticamente e invia un magic link. L'utente clicca il link e viene loggato. Per i login successivi: solo email → magic link.

## File da modificare

| File | Azione |
|------|--------|
| `supabase/functions/complete-purchase/index.ts` | Riscrivere: crea utente via REST API + invoca `signInWithOtp` via REST per inviare magic link |
| `src/pages/PaymentSuccess.tsx` | Riscrivere: rimuovere campi password, mostrare solo conferma + "controlla email" |
| `src/hooks/useAuth.tsx` | Aggiungere `sendMagicLink(email)` al context |
| `src/hooks/usePremiumStatus.ts` | Semplificare: solo check `is_premium` da DB, rimuovere fallback `verify-payment` |
| `src/components/LoginModal.tsx` | Convertire a magic link: solo campo email + "Invia link di accesso" |
| `src/components/PremiumModal.tsx` | Convertire login view a magic link (rimuovere campo password) |
| `src/pages/ExplorePage.tsx` | Nessuna modifica strutturale (usa già LoginModal/PremiumModal) |
| `src/pages/CollectionsPage.tsx` | Idem |
| `src/pages/CollectionDetailPage.tsx` | Idem |
| `src/pages/FreeSpotsPage.tsx` | Idem |

## Dettaglio tecnico

### 1. `complete-purchase/index.ts` — Nuova versione

Riceve `{ session_id }` (niente password).

```
1. Verifica pagamento Stripe (session.payment_status === "paid")
2. Recupera email da session
3. Cerca utente esistente via REST API
4. Se non esiste → crea utente (email, email_confirm: true, password casuale)
5. Attendi trigger handle_new_user (500ms)
6. Aggiorna profilo: is_premium = true, premium_since = now()
7. Invia magic link via REST POST /auth/v1/otp { email }
8. Ritorna { success: true, email }
```

Il magic link viene inviato via l'API OTP di Supabase Auth (REST), che genera e invia automaticamente l'email.

### 2. `PaymentSuccess.tsx` — Nuova versione semplificata

Nessun campo password. Il flusso:

```
1. Recupera email da get-session-email
2. Chiama complete-purchase (solo session_id)
3. Se OK → mostra "Pagamento completato! Controlla la tua email per accedere"
4. Se utente già loggato → verifica is_premium → redirect a /
5. Pulsante "Invia di nuovo il link" che chiama signInWithOtp
6. Recovery: se complete-purchase fallisce ma utente esiste → mostra messaggio rassicurante
```

### 3. `useAuth.tsx` — Aggiungere magic link

```typescript
const sendMagicLink = async (email: string) => {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: window.location.origin }
  });
  return { error };
};
```

Aggiungere `sendMagicLink` al context. Mantenere `signIn` con password per retrocompatibilità admin.

### 4. `usePremiumStatus.ts` — Semplificare

Solo check `is_premium` dal database. Rimuovere la chiamata a `verify-payment` nel queryFn.

```typescript
queryFn: async () => {
  if (!user) return false;
  const { data } = await supabase
    .from("profiles")
    .select("is_premium")
    .eq("user_id", user.id)
    .single();
  return data?.is_premium ?? false;
}
```

### 5. `LoginModal.tsx` — Magic link

Rimuovere campo password. Nuovo flusso:
- Campo email
- Pulsante "Invia link di accesso"
- Dopo invio: messaggio "Controlla la tua email per accedere"
- No errori tecnici visibili

### 6. `PremiumModal.tsx` — Login view magic link

Nella view "login", rimuovere campo password e usare magic link. Stesso pattern di LoginModal.

### 7. Sessione persistente

Già configurata in `client.ts`:
- `persistSession: true`
- `autoRefreshToken: true`

La durata sessione di 30 giorni è gestita dalla configurazione backend di Supabase (JWT expiry). La configurazione attuale è già corretta.

### Flusso finale

```text
Utente naviga free
  ↓
Clicca hotspot bloccato → PremiumModal
  ↓
"Sblocca tutto – €4.99" → Stripe Checkout
  ↓
Pagamento OK → redirect /payment-success?session_id=xxx
  ↓
complete-purchase: crea utente + is_premium + invia magic link
  ↓
PaymentSuccess mostra: "✅ Controlla la tua email!"
  ↓
Utente clicca magic link → auto-login → homepage premium
  ↓
Sessione 30 giorni → niente più login

Login successivo (altro device):
  Email → magic link → auto-login
```

