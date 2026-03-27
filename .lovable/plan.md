

## Rimozione paywall → gate email dopo 3 card

### Concetto
Tutto il contenuto è visibile senza blur/lock. Dopo che l'utente espande 3 card (click su "+"), appare un modal: "Ti piace Pipo? Lascia la tua email per continuare a esplorare." con campo email e magic link. Una volta loggato, nessun limite.

### Modifiche

#### 1. Nuovo hook `src/hooks/useCardGate.ts`
- Conta quante card l'utente ha espanso (stato locale, persistito in `localStorage`)
- Se l'utente è loggato (`useAuth`), nessun limite
- Espone: `{ shouldGate: boolean, onCardExpand: () => void, gateModalOpen, setGateModalOpen }`
- Dopo 3 espansioni → `gateModalOpen = true`

#### 2. Nuovo componente `src/components/EmailGateModal.tsx`
Modal con tono amichevole:
- IT: "Ti piace Pipo? 😎" / "Lascia la tua email per continuare a esplorare gratis. Nessun pagamento, nessun spam."
- EN: "Enjoying Pipo? 😎" / "Leave your email to keep exploring for free. No payment, no spam."
- Campo email + bottone "Continua" → invia magic link
- Stato "link inviato" con conferma
- Traduzioni aggiunte in `LanguageContext`

#### 3. `src/pages/ExplorePage.tsx` — Riscrittura
- Rimuovere: `usePremiumStatus`, `PremiumModal`, `firstPerCategory`, banner premium, logica `locked/isFree`
- Aggiungere: `useCardGate` hook + `EmailGateModal`
- Tutte le card renderizzate senza blur/lock
- Passare `onCardExpand` a `HotspotCard` (chiamato quando l'utente espande)
- Se `shouldGate` è true e utente non loggato, intercettare l'espansione e aprire il modal

#### 4. `src/components/HotspotCard.tsx` — Cleanup
- Rimuovere le prop `locked`, `isFree`, `onLockedClick`
- Rimuovere overlay Lock, badge FREE, blur
- Aggiungere prop opzionale `onBeforeExpand?: () => boolean` — se ritorna `false`, blocca l'espansione (usato dal gate)

#### 5. `src/components/HeroSection.tsx` — Cleanup
- Rimuovere import e uso di `PremiumModal`
- Rimuovere stato `premiumOpen`

#### 6. File da eliminare
- `src/components/PremiumModal.tsx`
- `src/hooks/usePremiumStatus.ts`
- `src/pages/PaymentSuccess.tsx`
- `supabase/functions/create-payment/index.ts`
- `supabase/functions/complete-purchase/index.ts`
- `supabase/functions/verify-payment/index.ts`

#### 7. `src/App.tsx`
- Rimuovere rotta `/payment-success`

#### 8. Traduzioni (`src/contexts/LanguageContext.tsx`)
- Aggiungere chiavi per EmailGateModal
- Rimuovere chiavi premium/payment non più usate (premiumMember, unlockAll, cardsAvailable, freeBadge, premiumBadge)

### Cosa NON cambia
- Login/logout header in ExplorePage resta (utile per chi si è già registrato)
- LoginModal resta disponibile per accesso diretto
- Database: le tabelle `profiles`, `granted_emails` restano (servono per l'auth)
- Le colonne `is_premium` nel DB restano (non servono migrazioni)
- Admin, collezioni, free spots invariati

