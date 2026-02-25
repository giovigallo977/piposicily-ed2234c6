

# Piano: Aggiornare i testi del PremiumModal

## Cosa cambia

Aggiornare le label dei due pulsanti nella vista "choice" del PremiumModal per usare la formula richiesta:

### Testi attuali → Nuovi testi

**Italiano:**
- `loginBtn`: "Già registrato? Accedi" → **"Sei già registrato? Accedi con mail e password"**
- `signupBtn`: "Sblocca tutto — €4.99" → **"Non sei registrato? Sblocca tutti gli hotspot a €4.99"**

**Inglese:**
- `loginBtn`: "Already registered? Log in" → **"Already registered? Log in with email and password"**
- `signupBtn`: "Unlock all — €4.99" → **"Not registered? Unlock all hotspots for €4.99"**

## File da modificare

| File | Modifica |
|------|----------|
| `src/components/PremiumModal.tsx` | Righe 37-38 (IT) e 60-61 (EN): aggiornare le stringhe `loginBtn` e `signupBtn` |

Nessuna modifica alla logica, solo copy.

