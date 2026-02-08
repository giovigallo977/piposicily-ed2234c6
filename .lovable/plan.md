
# Piano: Traduzione Automatica Contenuti Database + DNA Update

## Problema Identificato

I contenuti caricati dal database (tabella `site_content`) sono in italiano e **non vengono tradotti** quando l'utente seleziona inglese. Attualmente:

| Componente | Contenuto | Usa `useTranslatedContent`? |
|------------|-----------|---------------------------|
| HeroSection | `mission`, `mission_part2` | ✅ Sì |
| HeroSection | `headline`, `subtitle` | ❌ No |
| WizardPage | `alien_map_cta_title`, `alien_map_cta_desc`, `instagram_cta_btn` | ❌ No |
| ExplorePage | `alien_map_cta_title`, `alien_map_cta_desc`, `instagram_cta_btn` | ❌ No |

**Conseguenza**: Quando l'utente cambia lingua in EN, questi testi restano in italiano.

---

## Modifiche da Implementare

### 1. HeroSection - Aggiungere traduzione per headline e subtitle

**File: `src/components/HeroSection.tsx`**

Aggiungere hook di traduzione per `headline` e `subtitle`:

```typescript
// Aggiungi traduzione per headline e subtitle
const { translatedText: translatedHeadline, isTranslating: isTranslatingHeadline } = 
  useTranslatedContent(heroHeadlineContent?.content);
const { translatedText: translatedSubtitle, isTranslating: isTranslatingSubtitle } = 
  useTranslatedContent(heroSubtitleContent?.content);

// Usa traduzione dal DB, oppure fallback a t()
const headline = translatedHeadline || t("heroHeadline");
const subtitle = translatedSubtitle || t("heroSubheadline");
```

### 2. WizardPage - Aggiungere traduzione per CTA Instagram

**File: `src/pages/WizardPage.tsx`**

```typescript
import { useTranslatedContent } from "@/hooks/useTranslation";

// Aggiungi hook di traduzione
const { translatedText: translatedTitle } = useTranslatedContent(alienMapTitleContent?.content);
const { translatedText: translatedDesc } = useTranslatedContent(alienMapDescContent?.content);
const { translatedText: translatedBtn } = useTranslatedContent(instagramBtnContent?.content);

// Usa traduzione, fallback a t()
const alienMapTitle = translatedTitle || t("alienMapCtaTitle");
const alienMapDesc = translatedDesc || t("alienMapCtaDesc");
const instagramBtn = translatedBtn || t("instagramCtaBtn");
```

### 3. ExplorePage - Stesse modifiche di WizardPage

**File: `src/pages/ExplorePage.tsx`**

Applicare lo stesso pattern del WizardPage.

---

## 4. DNA del Progetto - Aggiornare documentazione

**File: `.knowledge/structure/backend-sync-principle.md`**

Aggiungere sezione sulla traduzione obbligatoria:

```markdown
## Traduzione Obbligatoria dei Contenuti DB

OGNI contenuto caricato da `site_content` DEVE essere tradotto:

### Pattern di Implementazione

// Sbagliato - il contenuto resta in italiano
const title = titleContent?.content || t("fallbackKey");

// Corretto - il contenuto viene tradotto via AI
const { translatedText } = useTranslatedContent(titleContent?.content);
const title = translatedText || t("fallbackKey");


### Flusso Dati

DB (italiano) → useTranslatedContent() → AI Translation → UI (lingua corrente)
                     ↓
               Se lingua = IT, ritorna originale
               Se lingua = EN, traduce via Edge Function
```

**File: `.knowledge/structure/design-principles.md`**

Aggiornare sezione "Sistema Multilingua" con regola esplicita:

```markdown
### Contenuti da Database
- OGNI contenuto da `site_content` DEVE usare `useTranslatedContent()`
- Il fallback `t("chiave")` viene usato SOLO se il DB non ha contenuto
- Il fallback è GIA tradotto (viene da LanguageContext)
```

---

## 5. File da Modificare

| File | Azione |
|------|--------|
| `src/components/HeroSection.tsx` | Aggiungere `useTranslatedContent` per headline e subtitle |
| `src/pages/WizardPage.tsx` | Aggiungere `useTranslatedContent` per le 3 CTA |
| `src/pages/ExplorePage.tsx` | Aggiungere `useTranslatedContent` per le 3 CTA |
| `.knowledge/structure/backend-sync-principle.md` | Aggiungere sezione traduzione obbligatoria |
| `.knowledge/structure/design-principles.md` | Aggiornare regole multilingua |

---

## 6. Logica di Fallback Corretta

```text
Passo 1: Carica contenuto da DB (site_content)
         ↓
Passo 2: Se esiste contenuto DB:
           → Passa a useTranslatedContent()
           → Se lingua IT: ritorna originale
           → Se lingua EN: traduce via Edge Function
         ↓
Passo 3: Se NON esiste contenuto DB:
           → Usa t("chiaveLanguageContext")
           → Già tradotto automaticamente
```

---

## 7. Verifica Post-Implementazione

Per confermare che tutto funziona:

1. Vai su `/` (homepage)
2. Verifica che headline, subtitle e mission siano in italiano
3. Cambia lingua in EN (toggle in header)
4. Verifica che headline, subtitle e mission diventino in inglese
5. Vai su `/wizard` e verifica che la sezione CTA Instagram sia tradotta
6. Vai su `/esplora` e verifica che sezione finale e footer siano tradotti
