

## Remove Auth & Payment — MVP Solo Esplorazione + Email

### Obiettivo
Eliminare ogni riferimento a login, account e pagamenti. L'app diventa completamente pubblica. L'unico input richiesto e' l'email (mail wall + waitlist experience).

### Modifiche

**1. `src/App.tsx`**
- Rimuovere `AuthProvider` wrapper globale
- Wrappare SOLO le route admin (`/auth`, `/admin`, `/admin-analytics`) in un `AuthProvider` locale
- Rimuovere import di `Auth` dalla route pubblica (la route `/auth` resta ma solo per admin)

**2. `src/hooks/useCardGate.ts`**
- Rimuovere import e uso di `useAuth`
- Cambiare `isUnlocked` da `!!user || emailDone` a solo `emailDone`

**3. `src/components/MinimalHeader.tsx`**
- Rimuovere `useAuth`, `LoginModal`, login/logout button
- Lo slot destro dell'header diventa vuoto (solo language selector + logo)

**4. `src/pages/ExplorePage.tsx`**
- Rimuovere `useAuth`, `LoginModal`, `loginModalOpen` state, login/logout button dall'header
- Mantenere `EmailGateModal` e `useCardGate`

**5. `src/pages/CollectionsPage.tsx`**
- Stesso: rimuovere auth + LoginModal, mantenere EmailGateModal

**6. `src/pages/CollectionDetailPage.tsx`**
- Stesso: rimuovere auth + LoginModal, mantenere EmailGateModal + inline block

**7. `src/pages/FreeSpotsPage.tsx`**
- Rimuovere auth + LoginModal + login/logout button

**8. `src/components/LoginModal.tsx`** — Eliminare il file

**9. `src/lib/trackEvent.ts`**
- Rimuovere `"payment_click"` dal type union

**10. `src/pages/AdminAnalytics.tsx`**
- Rimuovere la card "Payment Clicks", aggiornare il type `Counts`

**11. `supabase/functions/get-session-email/`** — Eliminare la edge function Stripe

### Migrazione DB
Aggiungere policy RLS per permettere a utenti anonimi di inserire in `granted_emails`:
```sql
CREATE POLICY "Anon can insert granted_emails"
ON public.granted_emails FOR INSERT TO anon
WITH CHECK (true);
```

### File NON toccati
- `useAuth.tsx`, `Auth.tsx`, `Admin.tsx`, `AdminAnalytics.tsx` (admin flow) — restano per l'accesso admin
- `EmailGateModal.tsx` — resta identico
- `ExperienceWaitlistModal.tsx` — resta identico
- `HeroSection.tsx` — nessun auth presente

