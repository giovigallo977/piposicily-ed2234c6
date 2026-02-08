# Principio di Sincronizzazione Frontend-Backend

## Regola Fondamentale

OGNI testo, CTA, o contenuto visibile all'utente nel frontend DEVE:
1. Avere una chiave corrispondente nel database (site_content)
2. Essere modificabile dal pannello admin
3. Usare fallback dal LanguageContext solo come default

## Flusso Obbligatorio per Nuove Feature

```text
1. Creare chiave(i) in site_content (database)
2. Aggiungere campo(i) nell'admin panel (src/pages/Admin.tsx)
3. Nel componente, leggere dal DB con fallback a t()
4. MAI lasciare testi hardcoded senza gestione backend
```

## Pattern di Implementazione

```typescript
// Nel componente frontend
const { data: contentFromDB } = useSiteContent("chiave_contenuto");
const { translatedText } = useTranslatedContent(contentFromDB?.content);
const { t } = useLanguage();

// Usa contenuto tradotto dal DB, fallback a t() se DB vuoto
const displayText = translatedText || t("chiaveFallback");
```

## ⚠️ Traduzione Obbligatoria dei Contenuti DB

OGNI contenuto caricato da `site_content` **DEVE** essere tradotto tramite `useTranslatedContent()`:

### Pattern CORRETTO ✅
```typescript
const { data: titleContent } = useSiteContent("titolo_cta");
const { translatedText } = useTranslatedContent(titleContent?.content);
const title = translatedText || t("fallbackKey");
```

### Pattern SBAGLIATO ❌
```typescript
// ERRORE: Il contenuto resta in italiano anche se l'utente seleziona EN
const title = titleContent?.content || t("fallbackKey");
```

### Flusso Dati

```text
DB (italiano) → useTranslatedContent() → AI Translation → UI (lingua corrente)
                     ↓
               Se lingua = IT, ritorna originale
               Se lingua = EN, traduce via Edge Function
```

## Verifica Pre-Deploy

Prima di considerare una feature completa, verificare:
- [ ] Tutti i testi sono in site_content
- [ ] L'admin può modificarli
- [ ] I componenti leggono dal DB
- [ ] Esistono fallback per retrocompatibilità

## Esempi di Chiavi Attuali

| Chiave DB | Usata in | Fallback |
|-----------|----------|----------|
| `alien_map_cta_title` | WizardPage, ExplorePage | `t("alienMapCtaTitle")` |
| `alien_map_cta_desc` | WizardPage, ExplorePage | `t("alienMapCtaDesc")` |
| `instagram_cta_btn` | WizardPage, ExplorePage | `t("instagramCtaBtn")` |
| `wizard_instagram_link` | WizardPage, ExplorePage | `#` |
| `hero_headline` | HeroSection | `t("heroHeadline")` |
| `hero_subtitle` | HeroSection | `t("heroSubtitle")` |
| `mission` | HeroSection | `t("missionText")` |

## Principio Immutabile

Questo principio fa parte del DNA del progetto. Ogni futura modifica al frontend che introduce nuovo testo utente DEVE seguire questo pattern senza eccezioni.
