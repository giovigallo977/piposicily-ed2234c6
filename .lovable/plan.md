

# Piano: Riorganizzare layout PremiumModal

## Cosa cambia

L'utente vuole invertire l'ordine e dare piu risalto al prezzo e al pulsante di sblocco. L'ordine attuale nella vista "choice" e:

1. Header + benefici + prezzo
2. Pulsante "Sei gia registrato?" (outline)
3. Pulsante "Non sei registrato? Sblocca..." (pieno)

Il nuovo ordine richiesto:

1. Header + benefici
2. **Prezzo €4.99 piu grande e in evidenza**
3. **Pulsante principale "Sblocca tutti gli hotspot per sempre a €4.99"** (pieno, prominente)
4. **Pulsante secondario "Sei gia registrato? Accedi con le tue credenziali"** (outline, sotto)

## Modifiche testi

**Italiano:**
- `signupBtn`: "Non sei registrato? Sblocca tutti gli hotspot a €4.99" → **"Sblocca tutti gli hotspot per sempre a €4.99"**
- `loginBtn`: "Sei già registrato? Accedi con mail e password" → **"Sei già registrato? Accedi con le tue credenziali"**

**Inglese:**
- `signupBtn`: "Not registered? Unlock all hotspots for €4.99" → **"Unlock all hotspots forever for €4.99"**
- `loginBtn`: "Already registered? Log in with email and password" → **"Already registered? Log in with your credentials"**

## Modifiche layout

Nella vista "choice" (righe 224-239), invertire l'ordine dei due pulsanti: prima il pulsante di sblocco (principale), poi il pulsante login (secondario). Il prezzo resta sopra i pulsanti com'e ora, gia ben visibile.

## File da modificare

| File | Modifica |
|------|----------|
| `src/components/PremiumModal.tsx` | Righe 37-38 e 60-61: aggiornare testi. Righe 224-239: invertire ordine pulsanti (sblocco prima, login dopo) |

Nessuna modifica alla logica, solo copy e ordine visivo.

