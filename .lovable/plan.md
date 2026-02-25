

# Piano: Separare Login da PremiumModal

## Problema identificato

Attualmente il pulsante **Login** nell'header apre il `PremiumModal`, che mostra prima "Sblocca tutto – €4.99" e poi il link "Hai gia pagato? Accedi". Questo e confuso: chi clicca **Login** vuole accedere, non vedere una schermata di pagamento.

I 4 punti essenziali richiesti sono gia implementati nel codice, ma c'e un problema UX critico: **Login e pagamento sono mescolati nello stesso modal**.

## Cosa funziona gia

1. **Stripe checkout** — `create-payment` edge function + redirect ✅
2. **Creazione password dopo pagamento** — `PaymentSuccess` + `complete-purchase` + `get-session-email` ✅
3. **Login per utenti che tornano** — form email+password nel PremiumModal (vista "login") ✅
4. **Guardia "gia premium"** — PremiumModal mostra "Sei gia Premium ✨" ✅

## Cosa va corretto

Il pulsante **Login** nell'header deve aprire **direttamente il form di login** (email + password), non il PremiumModal con il pulsante di pagamento.

### Soluzione

Creare un `LoginModal` separato, semplice:
- Titolo: "Accedi" / "Log in"
- Campi: email + password
- Pulsante: "Accedi"
- Dopo login: verifica premium, chiudi modal, toast di benvenuto
- Se credenziali errate: messaggio chiaro

Il `PremiumModal` resta per gli hotspot bloccati (pagamento + link "Hai gia pagato? Accedi").

### Flussi risultanti

```text
Pulsante "Login" in header
        → LoginModal (solo email + password)
        → Login → premium check → tutto sbloccato

Hotspot bloccato click
        → PremiumModal (pagamento + link login)
        → "Sblocca tutto" → Stripe → PaymentSuccess
        → oppure "Hai gia pagato? Accedi" → form login
```

## File da modificare/creare

| File | Azione |
|------|--------|
| `src/components/LoginModal.tsx` | **Nuovo** — Modal semplice con form login |
| `src/components/MinimalHeader.tsx` | Modifica — usare LoginModal invece di PremiumModal per il pulsante Login |
| `src/pages/ExplorePage.tsx` | Modifica — stesso cambio se ha un pulsante Login diretto |
| `src/pages/CollectionsPage.tsx` | Modifica — stesso cambio |
| `src/pages/CollectionDetailPage.tsx` | Modifica — stesso cambio |
| `src/pages/FreeSpotsPage.tsx` | Modifica — stesso cambio |

Nessuna modifica a edge functions, database, o logica di pagamento. Solo separazione UX tra Login e Acquisto.

