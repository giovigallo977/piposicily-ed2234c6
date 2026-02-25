

# Piano: Fix vista login nel PremiumModal

## Problemi identificati

1. **UX confusa**: Quando clicchi "Hai già pagato? Accedi", la vista login mostra ancora il prezzo €4.99 in alto + il form login sotto. Dovrebbe mostrare SOLO il form login pulito, con sotto un link per tornare alla vista pagamento.

2. **Login non funziona**: Il `handleLogin` nel PremiumModal usa ancora `setTimeout(600ms)` (non aggiornato come il LoginModal). Questo causa il mancato aggiornamento dello stato premium dopo il login.

## Correzioni

### 1. Vista "login" nel PremiumModal: layout pulito

Quando `view === "login"`:
- Nascondere il blocco prezzo (€4.99)
- Nascondere subtitle e benefits
- Mostrare solo: titolo "Accedi" + form email/password + pulsante "Accedi"
- Sotto il form: link "Sblocca tutti gli hotspot a €4.99" per tornare alla vista pagamento

### 2. Fix handleLogin: rimuovere setTimeout

Allineare la logica del `handleLogin` a quella già corretta nel `LoginModal`:
- Rimuovere `setTimeout`
- Fare `await` su `invalidateQueries` e `refetchQueries`
- Chiudere il modal dopo successo (sia premium che non)

## File da modificare

| File | Azione |
|------|--------|
| `src/components/PremiumModal.tsx` | Ristrutturare la vista login + fix handleLogin |

## Dettaglio modifiche PremiumModal.tsx

**handleLogin** (linee 99-125): sostituire il `setTimeout` con logica diretta come nel LoginModal:
```typescript
const { error } = await signIn(email, password);
if (error) { toast error; return; }
const { data: profile } = await supabase.from("profiles").select("is_premium").single();
if (profile?.is_premium) toast({ title: t.welcomeBack });
await queryClient.invalidateQueries({ queryKey: ["premium-status"] });
await queryClient.refetchQueries({ queryKey: ["premium-status"] });
handleOpenChange(false);
```

**Vista login** (linee 147-220): quando `view === "login"`, nascondere subtitle, benefits, e prezzo. Mostrare solo il form con titolo "Accedi" e sotto un link testuale "Sblocca tutti gli hotspot a €4.99 →" che torna alla vista main.

