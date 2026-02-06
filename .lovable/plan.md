

# Piano: Sincronizzazione Frontend-Backend per Nuove CTA

## Problema identificato

I testi delle nuove CTA Instagram (introdotte nell'ultima ottimizzazione) sono **hardcoded** nel `LanguageContext.tsx` invece di essere gestibili dal backend:

| Testo | Stato attuale | Dove appare |
|-------|---------------|-------------|
| "Vuoi una mappa ancora più aliena?" | Hardcoded | WizardPage, ExplorePage |
| "Se dopo aver esplorato gli hotspot..." | Hardcoded | WizardPage, ExplorePage |
| "Scrivimi su Instagram" | Hardcoded | WizardPage, ExplorePage |

Questo viola il principio del progetto: **ogni contenuto deve essere modificabile da admin senza toccare il codice**.

---

## Modifiche da implementare

### 1. Database: Nuove chiavi site_content

Aggiungere 3 nuove chiavi nella tabella `site_content`:

| key | content (IT default) |
|-----|----------------------|
| `alien_map_cta_title` | Vuoi una mappa ancora più aliena? |
| `alien_map_cta_desc` | Se dopo aver esplorato gli hotspot di Pipo vuoi un itinerario pensato solo per te, puoi sbloccare 1 mappa aliena segreta, scrivimi ALIENO in DM su Instagram |
| `instagram_cta_btn` | Scrivimi su Instagram |

### 2. Admin Panel: Espandere sezione Wizard Instagram

**File: `src/pages/Admin.tsx`**

Nella card "Wizard Instagram" (righe 603-653), aggiungere 3 nuovi campi:

```text
Wizard Instagram (CTA fine funnel)
├── Link Instagram          [esistente]
├── Titolo sezione CTA      [NUOVO - "Vuoi una mappa ancora più aliena?"]
├── Descrizione CTA         [NUOVO - "Se dopo aver esplorato..."]
└── Testo bottone           [NUOVO - "Scrivimi su Instagram"]
```

Modifiche tecniche:
- Aggiungere `useSiteContent` per le 3 nuove chiavi
- Aggiungere 3 nuovi state (`alienMapTitle`, `alienMapDesc`, `instagramBtnText`)
- Aggiungere 3 nuovi `useEffect` per sincronizzare i valori
- Aggiungere 3 nuovi campi Input/Textarea nella Card
- Aggiornare `handleSaveWizardInstagram` per salvare tutti i campi

### 3. Frontend: Leggere contenuti da database

**File: `src/pages/WizardPage.tsx`**

Aggiungere hook per leggere i contenuti:
```typescript
const { data: alienMapTitleContent } = useSiteContent("alien_map_cta_title");
const { data: alienMapDescContent } = useSiteContent("alien_map_cta_desc");
const { data: instagramBtnContent } = useSiteContent("instagram_cta_btn");
```

Sostituire i `t("...")` con i valori dal database (con fallback):
```typescript
const alienMapTitle = alienMapTitleContent?.content || t("alienMapCtaTitle");
const alienMapDesc = alienMapDescContent?.content || t("alienMapCtaDesc");
const instagramBtn = instagramBtnContent?.content || t("instagramCtaBtn");
```

**File: `src/pages/ExplorePage.tsx`**

Stesse modifiche del WizardPage.

### 4. DNA del progetto: Documentare il principio

**Nuovo file: `.knowledge/structure/backend-sync-principle.md`**

Creare documentazione che sancisce la regola immutabile:

```markdown
# Principio di Sincronizzazione Frontend-Backend

## Regola Fondamentale
OGNI testo, CTA, o contenuto visibile all'utente nel frontend DEVE:
1. Avere una chiave corrispondente nel database (site_content)
2. Essere modificabile dal pannello admin
3. Usare fallback dal LanguageContext solo come default

## Flusso Obbligatorio per Nuove Feature
1. Creare chiave(i) in site_content
2. Aggiungere campo(i) nell'admin panel
3. Nel componente, leggere dal DB con fallback a t()
4. MAI lasciare testi hardcoded senza gestione backend

## Verifica Pre-Deploy
Prima di considerare una feature completa, verificare:
- [ ] Tutti i testi sono in site_content
- [ ] L'admin può modificarli
- [ ] I componenti leggono dal DB
```

---

## File da modificare

| File | Azione |
|------|--------|
| `src/pages/Admin.tsx` | Aggiungere 3 nuovi campi nella sezione Wizard Instagram |
| `src/pages/WizardPage.tsx` | Usare `useSiteContent` invece di `t()` per i 3 testi CTA |
| `src/pages/ExplorePage.tsx` | Usare `useSiteContent` invece di `t()` per i 3 testi CTA |
| `.knowledge/structure/backend-sync-principle.md` | CREARE - documentazione principio |
| `.knowledge/structure/design-principles.md` | Aggiungere riferimento al nuovo principio |

---

## Flusso dati finale

```text
ADMIN PANEL                          DATABASE                         FRONTEND
     │                                   │                                │
     ├── Titolo CTA ───────────────────► alien_map_cta_title ──────────► WizardPage
     ├── Descrizione CTA ──────────────► alien_map_cta_desc ───────────► ExplorePage
     └── Testo bottone ────────────────► instagram_cta_btn ────────────► (entrambi)
```

---

## Note tecniche

### Traduzioni multilingua
I contenuti da database sono in italiano (lingua primaria). Per la versione inglese:
- Manteniamo i fallback nel `LanguageContext` che verranno usati se non c'è contenuto DB
- In futuro si potrebbe estendere site_content con chiavi `_en` (es: `alien_map_cta_title_en`)

### Backward compatibility
- I fallback `t("alienMapCtaTitle")` garantiscono che il sito funzioni anche senza dati nel DB
- Al primo save dall'admin, i valori verranno scritti nel database

