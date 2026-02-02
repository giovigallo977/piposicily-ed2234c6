
# Piano: Aggiornamento CTA Landing Pipo

## Situazione Attuale

Ho analizzato il codice e trovato:

| CTA | Posizione | Comportamento | Testo Attuale |
|-----|-----------|---------------|---------------|
| Wizard hotspot | `HeroSection.tsx` (homepage) | Naviga a `/wizard` | "Portami via da qui" |
| Instagram DM | `WizardPage.tsx` (wizard) | Apre link Instagram | "Scrivimi su Instagram" |

**NOTA:** Il pulsante Instagram attualmente si trova nel wizard, non nella hero section. Per rispettare la nuova gerarchia, dovrò spostarlo nella homepage.

---

## Cosa Faremo

### 1. Modifiche CTA "Esplora gli hotspot" (wizard)

**File:** `src/components/HeroSection.tsx` e `src/contexts/LanguageContext.tsx`

- Cambiare testo pulsante: `"Portami via da qui"` → `"Esplora gli hotspot di Pipo"`
- Micro-copy: `"Scopri gli hotspot alieni in base al tuo mood e alla zona che vuoi esplorare."`
- Stile: **secondario** (outline/ghost, meno prominente)
- Il comportamento resta identico (naviga a `/wizard`)

### 2. Aggiungere CTA "Sblocca 1 mappa aliena" (Instagram)

**File:** `src/components/HeroSection.tsx`

- Nuovo pulsante nella hero section con testo: `"Sblocca 1 mappa aliena"`
- Micro-copy: `"Scrivimi ALIENO in DM su Instagram e ti mando 1 dei 3 itinerari segreti per esplorare la Sicilia fuori dai radar."`
- Stile: **primario** (sfondo pieno, più prominente)
- Il comportamento: apre il link Instagram configurato nel database (`wizard_instagram_link`)

### 3. Gerarchia Visiva

| CTA | Ruolo | Stile |
|-----|-------|-------|
| "Sblocca 1 mappa aliena" | PRINCIPALE | Sfondo pieno nero, padding maggiore, posizione superiore |
| "Esplora gli hotspot di Pipo" | SECONDARIA | Bordo/outline, padding standard, posizione sotto |

### 4. Aggiornare Traduzioni

**File:** `src/contexts/LanguageContext.tsx`

Aggiungere nuove chiavi per IT e EN:
- `heroPrimaryCtaBtn`: "Sblocca 1 mappa aliena" / "Unlock 1 alien map"
- `heroPrimaryCtaSublabel`: micro-copy Instagram
- `heroSecondaryCtaBtn`: "Esplora gli hotspot di Pipo" / "Explore Pipo's hotspots"
- `heroSecondaryCtaSublabel`: micro-copy wizard

### 5. Database (opzionale)

Il contenuto `hero_cta` e `wizard_instagram_desc` nel database verranno aggiornati con i nuovi testi.

---

## File da Modificare

| File | Modifica |
|------|----------|
| `src/components/HeroSection.tsx` | Aggiungere CTA Instagram principale, riordinare gerarchia |
| `src/contexts/LanguageContext.tsx` | Nuove chiavi traduzioni IT/EN |
| Database `site_content` | Aggiornare `hero_cta` e `wizard_instagram_desc` |

---

## Risultato Finale

La hero section mostrerà:
1. **CTA PRINCIPALE** (nero pieno): "Sblocca 1 mappa aliena" + micro-copy Instagram
2. **CTA SECONDARIA** (outline): "Esplora gli hotspot di Pipo" + micro-copy wizard

Entrambi i pulsanti mantengono i loro comportamenti originali, cambia solo l'aspetto e la gerarchia visiva.
