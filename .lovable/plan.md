

# Sistema Premium "Remixed Pipo" - €4.99 Lifetime Access

## Panoramica

L'utente esplora liberamente la prima scheda di ogni categoria. Le altre sono bloccate con anteprima sfocata. Quando decide di acquistare, il flusso di checkout combina pagamento Stripe (€4.99 one-time) + creazione account in un unico step. Dopo l'acquisto, tutto e sbloccato per sempre.

## Architettura

```text
┌─────────────────────────────────────────────┐
│                  FRONTEND                    │
│                                              │
│  ExplorePage                                 │
│   ├─ calcola "prima per categoria" = free    │
│   ├─ passa locked={true/false} a HotspotCard │
│   └─ mostra banner "X/Y schede disponibili" │
│                                              │
│  HotspotCard                                 │
│   ├─ se locked: blur + overlay "PREMIUM"     │
│   └─ click su locked → apre PremiumModal     │
│                                              │
│  PremiumModal                                │
│   ├─ benefici + prezzo €4.99                 │
│   ├─ form email/password (registrazione)     │
│   └─ bottone "Paga e sblocca"               │
│       → crea account → Stripe checkout       │
│                                              │
│  usePremiumStatus hook                       │
│   ├─ controlla auth.user → profiles.premium  │
│   └─ espone isPremium boolean                │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│                  BACKEND                     │
│                                              │
│  DB: profiles table                          │
│   ├─ user_id (ref auth.users)               │
│   ├─ is_premium boolean                     │
│   ├─ premium_since timestamp                │
│   └─ stripe_session_id text                 │
│                                              │
│  DB: trigger on auth.users insert            │
│   └─ auto-crea riga in profiles              │
│                                              │
│  Edge Function: create-checkout              │
│   └─ crea Stripe Checkout Session            │
│                                              │
│  Edge Function: stripe-webhook               │
│   └─ checkout.session.completed              │
│       → UPDATE profiles SET is_premium=true  │
│                                              │
│  Stripe: prodotto one-time €4.99             │
└─────────────────────────────────────────────┘
```

## Dettaglio implementazione

### 1. Database (migrazioni)

**Tabella `profiles`:**
- `id uuid PK default gen_random_uuid()`
- `user_id uuid NOT NULL references auth.users(id) ON DELETE CASCADE, UNIQUE`
- `is_premium boolean NOT NULL DEFAULT false`
- `premium_since timestamptz`
- `stripe_session_id text`
- `created_at timestamptz NOT NULL DEFAULT now()`

**Trigger:** auto-crea profilo alla registrazione utente.

**RLS:** utenti possono leggere solo il proprio profilo; update solo del proprio; webhook aggiorna via service_role.

### 2. Stripe Integration

Abilito Stripe tramite il tool dedicato. Creo un prodotto one-time da €4.99.

**Edge function `create-checkout`:**
- Riceve `user_id` dall'utente autenticato
- Crea Stripe Checkout Session con `mode: "payment"`, prezzo €4.99
- Restituisce URL di checkout

**Edge function `stripe-webhook`:**
- Verifica firma Stripe
- Su evento `checkout.session.completed`: aggiorna `profiles.is_premium = true`

### 3. Flusso utente nel frontend

**PremiumModal (nuovo componente):**
- Si apre quando l'utente clicca su una scheda bloccata
- Mostra benefici: accesso completo, nessun abbonamento, aggiornamenti futuri
- Form di registrazione (email + password) integrato
- Bottone "Paga €4.99 e sblocca tutto"
- Flow: `signUp()` → `create-checkout` → redirect a Stripe → ritorno su app → webhook aggiorna DB → app rileva premium

**Se l'utente e gia registrato** (ha gia un account ma non premium): mostra solo il bottone di pagamento senza il form di registrazione.

### 4. Hook `usePremiumStatus`

```typescript
// Controlla se l'utente corrente e premium
// Se non autenticato → isPremium = false
// Se autenticato → query profiles.is_premium
```

### 5. Modifiche a ExplorePage

- Raggruppa hotspot per categoria
- Per ogni categoria: il primo (per ordine) e gratuito, gli altri richiedono premium
- Se `isPremium` → tutti sbloccati
- Banner in alto: "X/Y schede disponibili — Sblocca tutto!"

### 6. Modifiche a HotspotCard

- Ri-aggiunta prop `locked`
- Se locked: immagine sfocata, overlay con badge "PREMIUM", click apre PremiumModal
- Badge "GRATUITO" sulla prima scheda di ogni categoria
- Dopo acquisto: nessun badge, tutto visibile

### 7. Pagina post-acquisto

- Nella pagina Esplora, se premium: piccolo badge "Membro Premium" nell'header
- Toast di benvenuto "Grazie! Hai accesso completo a Pipo"

## File coinvolti

| File | Azione |
|------|--------|
| `src/hooks/usePremiumStatus.ts` | Nuovo — hook per stato premium |
| `src/components/PremiumModal.tsx` | Nuovo — modal checkout + registrazione |
| `src/components/HotspotCard.tsx` | Modifica — ri-aggiunta locked + badge |
| `src/pages/ExplorePage.tsx` | Modifica — logica free/locked + banner |
| `src/hooks/useAuth.tsx` | Modifica — aggiunta signUp |
| `supabase/functions/create-checkout/index.ts` | Nuovo — edge function |
| `supabase/functions/stripe-webhook/index.ts` | Nuovo — edge function |
| Migrazione DB | Nuova — tabella profiles + trigger |

## Ordine di esecuzione

1. Abilito Stripe (tool)
2. Migrazione DB (profiles + trigger)
3. Edge functions (create-checkout + stripe-webhook)
4. Hook usePremiumStatus
5. Aggiornamento useAuth con signUp
6. Componente PremiumModal
7. Aggiornamento HotspotCard (locked + badge)
8. Aggiornamento ExplorePage (logica free/locked + banner)

