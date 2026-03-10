

## Piano: Accesso gratuito admin + Collezioni free

### Due richieste:

**1. Dare accesso premium gratuito a utenti specifici**

Attualmente il tab "Registro Utenti" nel pannello Admin è solo in lettura. Il piano:

- **Aggiungere un form** in cima al tab `AdminUsersTab.tsx` con un campo email + pulsante "Regala Premium"
- Il form chiama una **edge function `grant-premium`** che:
  - Cerca il profilo per email nella tabella `profiles`
  - Se l'utente esiste: imposta `is_premium = true` e `premium_since = now()`
  - Se l'utente NON esiste ancora (non si è mai registrato): crea un record in `profiles` con `is_premium = true` usando l'email, senza `user_id` — **ma questo non funzionerebbe** perché `user_id` è NOT NULL
  - **Alternativa migliore**: l'admin inserisce l'email, il sistema la salva in una **nuova tabella `granted_emails`**. Quando l'utente fa login con quell'email (magic link), un trigger o la logica di `usePremiumStatus` controlla anche `granted_emails` per attivare automaticamente il premium

**Approccio scelto — tabella `granted_emails`:**
- Creare tabella `granted_emails` con colonne: `id`, `email` (unique), `created_at`
- RLS: solo authenticated può INSERT/SELECT/DELETE
- Modificare `usePremiumStatus.ts`: oltre a controllare `profiles.is_premium`, controlla anche se `user.email` è presente in `granted_emails`
- Modificare `AdminUsersTab.tsx`: aggiungere form per inserire email + lista delle email "regalate" con possibilità di rimuoverle
- Il trigger `handle_new_user` esistente crea il profilo; al primo login l'utente avrà accesso premium perché la sua email è in `granted_emails`

**2. Rendere le Collezioni gratuite (senza paywall)**

In `CollectionDetailPage.tsx` (righe 82-95), le card oltre la prima sono bloccate per utenti non-premium. Modifiche:
- Rimuovere la logica `isLocked` / `isFreeCard`: tutte le card della collezione saranno sempre sbloccate
- Rimuovere il banner premium (righe 58-71)
- Rimuovere `usePremiumStatus` e `PremiumModal` dalla pagina se non più necessari

Il paywall rimane attivo su `ExplorePage.tsx` (la pagina esplora per categoria) — solo le collezioni diventano gratuite.

### File coinvolti

| File | Modifica |
|------|----------|
| Migration SQL | Crea tabella `granted_emails` |
| `src/components/AdminUsersTab.tsx` | Form per aggiungere/rimuovere email gratuite |
| `src/hooks/usePremiumStatus.ts` | Controlla anche `granted_emails` |
| `src/pages/CollectionDetailPage.tsx` | Rimuove paywall, tutte le card sbloccate |

### Dettaglio tecnico

```sql
CREATE TABLE public.granted_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.granted_emails ENABLE ROW LEVEL SECURITY;
-- Solo authenticated può gestire
CREATE POLICY "Auth can select" ON public.granted_emails FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth can insert" ON public.granted_emails FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth can delete" ON public.granted_emails FOR DELETE TO authenticated USING (true);
```

```typescript
// usePremiumStatus.ts — logica aggiornata
const { data: grantedData } = await supabase
  .from("granted_emails")
  .select("id")
  .eq("email", user.email)
  .maybeSingle();
return data?.is_premium || !!grantedData;
```

