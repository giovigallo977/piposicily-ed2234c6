

# Piano: Sistema Premium senza Stripe (per ora)

Implemento tutta la parte frontend del sistema premium (badge, blur, modal, logica free/locked) e la parte database (tabella profiles, trigger, RLS). Stripe verrà configurato in seguito — per ora il bottone di pagamento nel modal mostrerà un placeholder.

## Cosa viene fatto ora

### 1. Database — Migrazione
- Creo tabella `profiles` con `user_id`, `is_premium`, `premium_since`, `stripe_session_id`
- Trigger per auto-creare profilo alla registrazione
- RLS: ogni utente legge solo il proprio profilo

### 2. `src/hooks/useAuth.tsx` — Aggiunta `signUp`
- Aggiungo funzione `signUp(email, password)` al context

### 3. `src/hooks/usePremiumStatus.ts` — Nuovo
- Se non autenticato: `isPremium = false`
- Se autenticato: query `profiles.is_premium`

### 4. `src/components/PremiumModal.tsx` — Nuovo
- Modal con benefici (accesso completo, nessun abbonamento, aggiornamenti futuri)
- Due stati: utente non loggato (form registrazione) / utente loggato non premium (solo bottone pagamento)
- Bottone "Paga €4.99" — per ora mostra toast "Stripe sarà configurato a breve"
- Design accattivante con lista benefici

### 5. `src/components/HotspotCard.tsx` — Modifica
- Aggiungo props `locked` e `isFree`
- Se `locked`: immagine sfocata, overlay con icona Lock + "PREMIUM", click apre PremiumModal
- Se `isFree`: badge "GRATUITO" verde
- Se né locked né free (utente premium): nessun badge

### 6. `src/pages/ExplorePage.tsx` — Modifica
- Raggruppo hotspot per categoria, il primo di ogni categoria è gratuito
- Se `isPremium` → tutto sbloccato, nessun badge
- Banner in alto: "X/Y schede disponibili — Sblocca tutto!"
- Se premium: badge "Membro Premium"

## Cosa viene rimandato
- Abilitazione Stripe e creazione Edge Functions (`create-checkout`, `stripe-webhook`)
- Il bottone di pagamento nel modal sarà un placeholder funzionale

## File coinvolti

| File | Azione |
|------|--------|
| Migrazione DB | Nuova — profiles + trigger + RLS |
| `src/hooks/useAuth.tsx` | Modifica — signUp |
| `src/hooks/usePremiumStatus.ts` | Nuovo |
| `src/components/PremiumModal.tsx` | Nuovo |
| `src/components/HotspotCard.tsx` | Modifica — locked/free/badge |
| `src/pages/ExplorePage.tsx` | Modifica — logica categoria + banner |

