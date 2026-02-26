

# Piano: Flusso post-pagamento resiliente e senza errori

## Causa radice

Dai log: `supabaseAdmin.auth.admin.updateUser is not a function`. Il pacchetto `@supabase/supabase-js@2.57.2` importato via npm nell'edge function non espone correttamente le API admin. Questo causa il 500 per gli utenti esistenti. Per i nuovi utenti, `listUsers()` probabilmente fallisce allo stesso modo quando ci sono molti utenti.

## Correzioni

### 1. Fix `complete-purchase/index.ts` — Usare REST API dirette per admin auth

Sostituire le chiamate `supabaseAdmin.auth.admin.*` con chiamate REST dirette alle API admin di Supabase, che funzionano sempre:

- **listUsers** → `GET /auth/v1/admin/users?filter=email`  
- **createUser** → `POST /auth/v1/admin/users`  
- **updateUser** → `PUT /auth/v1/admin/users/{id}`  

Tutte con header `Authorization: Bearer SERVICE_ROLE_KEY` e `apikey: SERVICE_ROLE_KEY`.

### 2. Fix `PaymentSuccess.tsx` — Recovery automatico senza errore rosso

Modificare `handleSubmit`:

```
1. Chiama complete-purchase
2. Se OK → auto-login → setCompleted(true)
3. Se FALLISCE:
   a. NON mostrare errore
   b. Tentare auto-login con email + password (l'utente potrebbe essere già stato creato)
   c. Se login OK → chiama verify-payment → se premium → setCompleted(true)
   d. Solo se tutto fallisce → messaggio rassicurante (no errore tecnico)
```

Messaggio finale di fallback:
- IT: "C'è stato un problema tecnico. Il tuo pagamento è registrato. Riprova tra qualche secondo o accedi manualmente."
- EN: "There was a technical issue. Your payment is registered. Please try again in a few seconds or log in manually."

### 3. `verify-payment/index.ts` — Già corretto

Il codice attuale cerca già sia via customer che via email nelle sessions. Nessuna modifica necessaria.

## File da modificare

| File | Azione |
|------|--------|
| `supabase/functions/complete-purchase/index.ts` | Sostituire auth.admin.* con REST API dirette |
| `src/pages/PaymentSuccess.tsx` | Recovery automatico nel handleSubmit |

## Dettaglio tecnico: complete-purchase REST API

```typescript
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const headers = {
  "Authorization": `Bearer ${serviceRoleKey}`,
  "apikey": serviceRoleKey,
  "Content-Type": "application/json"
};

// List users by email
const listRes = await fetch(`${supabaseUrl}/auth/v1/admin/users?page=1&per_page=50`, { headers });
const { users } = await listRes.json();
const existingUser = users?.find(u => u.email === email);

// Create user
const createRes = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
  method: "POST", headers,
  body: JSON.stringify({ email, password, email_confirm: true })
});

// Update user password
const updateRes = await fetch(`${supabaseUrl}/auth/v1/admin/users/${userId}`, {
  method: "PUT", headers,
  body: JSON.stringify({ password })
});
```

## Dettaglio tecnico: PaymentSuccess handleSubmit

```typescript
const handleSubmit = async () => {
  // validation...
  setLoading(true);
  try {
    const { data, error } = await supabase.functions.invoke("complete-purchase", {
      body: { session_id: sessionId, password },
    });
    
    if (!error && data?.success) {
      // Happy path
      await signIn(data.email, password);
      await queryClient.invalidateQueries({ queryKey: ["premium-status"] });
      toast({ title: t.successToast });
      setCompleted(true);
      return;
    }
    
    // Recovery: try login anyway (user may have been created despite error)
    const { error: loginError } = await signIn(email, password);
    if (!loginError) {
      // Logged in — verify premium via verify-payment
      const { data: verifyData } = await supabase.functions.invoke("verify-payment");
      if (verifyData?.isPremium) {
        await queryClient.invalidateQueries({ queryKey: ["premium-status"] });
        toast({ title: t.successToast });
        setCompleted(true);
        return;
      }
    }
    
    // Final fallback: reassuring message
    toast({ title: t.recoveryError });
  } catch {
    toast({ title: t.recoveryError });
  } finally {
    setLoading(false);
  }
};
```

