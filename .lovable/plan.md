

# Piano: Rinominare tutti i pulsanti "Scrivimi su Instagram"

## Situazione Attuale

Ho trovato il pulsante "Scrivimi su Instagram" in **3 pagine**:

| Pagina | Posizione | Usa traduzione |
|--------|-----------|----------------|
| WizardPage.tsx | Menu principale wizard | `wizardInstagramBtn` |
| ExplorePage.tsx | Fondo pagina esplora | `wizardInstagramBtn` |
| HeroSection.tsx | Homepage (già aggiornato) | `heroPrimaryCtaBtn` |

## Cosa Faremo

### Aggiornare le traduzioni in `LanguageContext.tsx`

Modificheremo le chiavi `wizardInstagramBtn` e `wizardInstagramDesc` per usare i nuovi testi:

**Italiano:**
- `wizardInstagramBtn`: "Scrivimi su Instagram" → **"Sblocca 1 mappa aliena"**
- `wizardInstagramDesc`: vecchio micro-copy → **"Scrivimi ALIENO in DM su Instagram e ti mando 1 dei 3 itinerari segreti per esplorare la Sicilia fuori dai radar."**

**English:**
- `wizardInstagramBtn`: "Write me on Instagram" → **"Unlock 1 alien map"**
- `wizardInstagramDesc`: vecchio micro-copy → **"DM me ALIENO on Instagram and I'll send you 1 of 3 secret itineraries to explore Sicily off the radar."**

## File da Modificare

| File | Modifica |
|------|----------|
| `src/contexts/LanguageContext.tsx` | Aggiornare `wizardInstagramBtn` e `wizardInstagramDesc` per IT e EN |

## Risultato Finale

Tutti i pulsanti Instagram nell'app (WizardPage, ExplorePage) mostreranno:
- **Testo**: "Sblocca 1 mappa aliena"
- **Micro-copy**: "Scrivimi ALIENO in DM su Instagram..."

Il comportamento rimane identico (apre il link Instagram dal database).

