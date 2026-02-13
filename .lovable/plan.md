
# Piano: Rimuovere Wizard, Instagram CTA e tutto il flusso mood/zona/esplora

## Cosa viene rimosso

### 1. Pagina Wizard (`src/pages/WizardPage.tsx`) - ELIMINARE
L'intero file. Contiene il flusso "Portami via da qui" con le opzioni Zona, Mood, Esplora in Liberta e la sezione "Scrivimi su Instagram".

### 2. Route `/wizard` in `src/App.tsx`
Rimuovere l'import di `WizardPage` e la route `/wizard`.

### 3. Barra fissa Instagram in `src/pages/ExplorePage.tsx`
- Rimuovere la barra fissa in basso con "Scrivimi su Instagram"
- Rimuovere tutti gli hook `useSiteContent` relativi a Instagram (`wizard_instagram_link`, `alien_map_cta_title`, `alien_map_cta_desc`, `instagram_cta_btn`)
- Rimuovere le traduzioni correlate (`useTranslatedContent` per titolo, desc, btn)
- Rimuovere i filtri `zona` e `mood` dai parametri URL (restano solo `categoria` e il filtro dropdown)
- Aggiornare la navigazione "indietro" per tornare sempre a `/` invece di `/wizard`
- Rimuovere le pill dei filtri zona/mood nella UI

### 4. Sezione Admin "Wizard Instagram" in `src/pages/Admin.tsx`
- Rimuovere la Card "Wizard Instagram" con tutti i campi (link, desc, titolo mappa aliena, desc mappa aliena, testo bottone)
- Rimuovere gli hook, state e useEffect correlati (`wizardInstagramLink`, `wizardInstagramDesc`, `alienMapTitle`, `alienMapDesc`, `instagramBtnText`)
- Rimuovere la funzione `handleSaveWizardInstagram`

### 5. Traduzioni in `src/contexts/LanguageContext.tsx`
Rimuovere le chiavi di traduzione:
- `wizardTitle`, `wizardZona`, `wizardMood`, `wizardExplore`, `wizardYourTurn`
- `alienMapCtaTitle`, `alienMapCtaDesc`, `instagramCtaBtn`

### 6. Asset `src/assets/pin-icon.png` - ELIMINARE
Usato solo dal wizard per le zone.

---

## File coinvolti

| File | Azione |
|------|--------|
| `src/pages/WizardPage.tsx` | Eliminare |
| `src/assets/pin-icon.png` | Eliminare |
| `src/App.tsx` | Rimuovere import WizardPage e route /wizard |
| `src/pages/ExplorePage.tsx` | Rimuovere Instagram CTA, filtri zona/mood, riferimenti wizard |
| `src/pages/Admin.tsx` | Rimuovere Card "Wizard Instagram" e relativi state/hook |
| `src/contexts/LanguageContext.tsx` | Rimuovere chiavi wizard e Instagram |

## Cosa NON cambia

- Homepage con le card categorie e la griglia 2x2
- Pagina Missione (`/missione`)
- Il filtro per categoria (dropdown) nella pagina Esplora
- L'effetto blur/lock sugli hotspot dal 4o in poi
- La pagina Admin per contenuti hero, foto categorie e missione
