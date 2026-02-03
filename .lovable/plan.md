

# Piano: Aggiornamento Backend per le nuove CTA

## Situazione Attuale nel Database

Ho trovato questi contenuti che devono essere aggiornati:

| Chiave | Contenuto Attuale | Azione |
|--------|-------------------|--------|
| `hero_cta` | "Portami via da qui" | Obsoleto, non più utilizzato |
| `wizard_instagram_desc` | "Scrivimi ALIENO in DM su Instagram e ti mando percorsi super alieni..." | Allineare al nuovo micro-copy |

## Modifiche da Fare

### 1. Aggiornare `wizard_instagram_desc`

**Da:**
```
Scrivimi ALIENO in DM su Instagram e ti mando percorsi super alieni per esplorare la Sicilia fuori dai radar
```

**A:**
```
Scrivimi ALIENO in DM su Instagram e ti mando 1 dei 3 itinerari segreti per esplorare la Sicilia fuori dai radar.
```

### 2. Aggiornare `hero_cta` (opzionale - per consistenza)

Anche se non viene più utilizzato direttamente, lo aggiorno per mantenere coerenza:

**Da:** `Portami via da qui`
**A:** `Sblocca 1 mappa aliena`

## Query SQL da Eseguire

```sql
UPDATE site_content 
SET content = 'Scrivimi ALIENO in DM su Instagram e ti mando 1 dei 3 itinerari segreti per esplorare la Sicilia fuori dai radar.'
WHERE key = 'wizard_instagram_desc';

UPDATE site_content 
SET content = 'Sblocca 1 mappa aliena'
WHERE key = 'hero_cta';
```

## Verifica Pre-Lancio

Dopo le modifiche al database, verificherò:

1. Homepage: CTA principale "Sblocca 1 mappa aliena" con micro-copy corretto
2. Homepage: CTA secondaria "Esplora gli hotspot di Pipo" con micro-copy corretto
3. Wizard: Pulsante "Sblocca 1 mappa aliena" con micro-copy aggiornato
4. Explore Page: Pulsante "Sblocca 1 mappa aliena" con micro-copy aggiornato
5. Toggle lingua IT/EN funzionante su tutte le CTA

## File già Aggiornati (nessuna modifica necessaria)

- `src/contexts/LanguageContext.tsx` - Traduzioni già aggiornate
- `src/components/HeroSection.tsx` - Già configurato con nuova gerarchia CTA
- `WizardPage.tsx` e `ExplorePage.tsx` - Usano le chiavi di traduzione già aggiornate

