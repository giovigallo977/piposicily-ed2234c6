

# Piano: Struttura accesso e pagamento Pipo Sicily

## Stato attuale vs richiesta

Analizzando il codice, la maggior parte del flusso descritto e gia implementata correttamente. Ecco cosa funziona e cosa va sistemato:

### Gia funzionante
- 1 hotspot gratuito per categoria e collezione, resto bloccato con lucchetto
- Free Spots interamente gratuiti
- Premium Modal con flusso signup/login + pagamento Stripe a 4,99 euro
- Pagina payment-success con verifica automatica
- Icona Login in alto a destra nelle pagine Esplora, Collezioni, Dettaglio Collezione, Free Spots

### Da sistemare (3 problemi)

**1. Manca il pulsante Logout per utenti autenticati**
In tutte le pagine (Esplora, Collezioni, Dettaglio Collezione, Free Spots) quando l'utente e autenticato si vede solo uno spazio vuoto dove dovrebbe esserci il Login. Serve un pulsante Logout visibile.

**2. Homepage senza Login/Logout**
La homepage (`Index.tsx` con `MinimalHeader.tsx`) non ha nessun pulsante di login o logout. Serve aggiungerlo in alto a destra, coerente con le altre pagine.

**3. La registrazione senza pagamento non deve essere possibile**
Attualmente nel PremiumModal il flusso "signup" crea l'account e mostra "controlla la mail" ma non forza il pagamento. Secondo la specifica, la registrazione deve avvenire SOLO durante il pagamento. Il flusso corretto e:
- L'utente clicca "Sblocca tutto"
- Inserisce email + password
- Dopo la creazione account, viene automaticamente reindirizzato a Stripe per pagare
- Non esiste registrazione gratuita

## Modifiche previste

### 1. Aggiungere Logout in tutte le pagine navigate

**File coinvolti:** `ExplorePage.tsx`, `CollectionsPage.tsx`, `CollectionDetailPage.tsx`, `FreeSpotsPage.tsx`

Dove ora c'e `<div className="w-8" />` (o `w-12`) per utenti autenticati, mostrare invece un pulsante Logout che chiama `signOut()` dall'hook `useAuth`.

### 2. Aggiungere Login/Logout nella Homepage

**File coinvolti:** `MinimalHeader.tsx`

Aggiungere in alto a destra (al posto dello spazio vuoto `<div className="w-10" />`):
- Se non autenticato: icona Login che apre il PremiumModal
- Se autenticato: icona Logout
- Il PremiumModal va aggiunto anche nella homepage (`Index.tsx`)

### 3. Forzare il pagamento dopo la registrazione

**File coinvolto:** `PremiumModal.tsx`

Modificare `handleSignup` in modo che dopo la creazione dell'account, il sistema:
1. Faccia automaticamente login (signIn) con le credenziali appena inserite
2. Invochi `create-payment` per generare la sessione Stripe
3. Redirect a Stripe per il pagamento

Il flusso diventa: signup -> auto-login -> redirect Stripe. Se l'utente non paga, ha comunque un account ma non e premium (puo solo vedere i contenuti gratuiti + Free Spots, come da specifica).

Nota: la conferma email e attiva, quindi il flusso auto-login dopo signup potrebbe fallire se l'email non e ancora confermata. In questo caso, il messaggio "controlla la mail" resta, e dopo la conferma l'utente puo fare login dal PremiumModal e poi pagare. Questo e coerente con la specifica.

### Nessuna modifica al database
Tutto il necessario e gia presente nel database.

## Riepilogo modifiche file

| File | Modifica |
|------|----------|
| `src/components/MinimalHeader.tsx` | Aggiunta icona Login/Logout in alto a destra |
| `src/pages/Index.tsx` | Aggiunta PremiumModal |
| `src/pages/ExplorePage.tsx` | Sostituire spazio vuoto con pulsante Logout |
| `src/pages/CollectionsPage.tsx` | Sostituire spazio vuoto con pulsante Logout |
| `src/pages/CollectionDetailPage.tsx` | Sostituire spazio vuoto con pulsante Logout |
| `src/pages/FreeSpotsPage.tsx` | Sostituire spazio vuoto con pulsante Logout |
| `src/components/PremiumModal.tsx` | Dopo signup, tentare auto-login + redirect Stripe |

