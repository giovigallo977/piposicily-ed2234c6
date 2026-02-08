# Principi di Design - Struttura Immutabile

## Filosofia
Ogni decisione strutturale documentata qui è DEFINITIVA. Le modifiche future devono rispettare questi principi senza eccezioni.

## Identità Visiva

### Colori Brand
- **Verde Pipo (olive)**: `#3a9f6d` / HSL `152 46% 43%` - Usato per azioni primarie (NAVIGA, espansione card)
- **Foreground**: Toni caldi neutri (30 10% 15%)
- **Background**: Bianco puro

### Palette Soft & Playful (2025)
- **Mint**: HSL `152 40% 95%` - Verde menta chiaro per sfondi e bordi
- **Lavender**: HSL `260 40% 93%` - Lavanda pastello per badge categoria
- **Warm Yellow**: HSL `48 96% 89%` - Accento opzionale per highlight

### Tipografia
- **Titoli**: Proxima Nova Bold (font-heading)
- **Body**: Nunito / Proxima Nova Regular (font-body, font-friendly)
- **Brand/CTA**: Inter Black Italic (font-brand)

### Spaziatura e Forme
- Padding card: 20px (p-5)
- Border radius card: 24px (rounded-3xl)
- Border radius bottoni: pill (rounded-full)
- Gap tra elementi: coerente e generoso

### Stile Componenti

#### Cards
- Background: bianco con bordo mint (`border-mint`)
- Ombra: morbida con tinta verde (`shadow-lg shadow-olive/10`)
- Transizioni smooth al hover

#### Bottoni
- Forma: pill/rounded-full
- Bottone espansione: 40x40px con scala al hover
- CTA: include emoji/icona, effetto scala al hover
- Background: olive con ombra al hover

#### Badge Categoria
- Background: lavanda pastello (`bg-lavender`)
- Testo: foreground con font semibold
- Forma: pill (`rounded-full`)

#### Header
- Background: gradient da mint a background
- Bottoni menu/filtro: stile pill con sfondo mint
- Ombra sottile al hover

#### Sfondo Pagina
- Gradient: mint in alto che sfuma verso background

### Animazioni
- Scala hover: 1.05-1.10 per elementi interattivi
- Durata transizioni: 200ms
- Ombre enhanced al hover per profondità

## Principi UX Immutabili

### 1. Leggibilità Prima di Tutto
- Testi descrittivi MAI troncati se importanti per l'utente
- Line-clamp solo per preview, mai per contenuti informativi

### 2. Gerarchia Chiara
- Immagine → Titolo → Descrizione → Azione
- Ogni livello deve essere distinguibile

### 3. Azioni Evidenti
- Bottoni sempre con colore distintivo
- Icone accompagnano sempre il testo dell'azione

## Comportamento PWA - Immutabile

### Auto-Update Obbligatorio
- La PWA DEVE aggiornarsi automaticamente senza intervento utente
- `skipWaiting: true` e `clientsClaim: true` sono OBBLIGATORI
- Check aggiornamenti ogni 60 secondi
- Check aggiornamenti quando l'utente torna all'app (visibility change)
- Reload automatico quando nuovo service worker prende controllo

### Caching Strategy
- API Supabase: NetworkFirst (5 min cache)
- Immagini: CacheFirst (7 giorni cache)
- Assets statici: precached automaticamente

## Sistema Multilingua - OBBLIGATORIO

### Principio Fondamentale
OGNI testo visibile all'utente DEVE usare il sistema di traduzione:
- **Testi statici UI**: Usare `t("chiave")` da `useLanguage()`
- **Contenuti dinamici (DB)**: Usare `useTranslatedContent()` o `useTranslatedHotspot()`
- **aria-label**: Usare `t("backLabel")` invece di stringhe hardcoded

### ⚠️ Contenuti da Database (site_content) - CRITICO
- OGNI contenuto da `site_content` **DEVE** usare `useTranslatedContent()`
- Il fallback `t("chiave")` viene usato SOLO se il DB non ha contenuto
- Il fallback è GIÀ tradotto (viene da LanguageContext)

**Pattern obbligatorio:**
```typescript
const { data: content } = useSiteContent("chiave_db");
const { translatedText } = useTranslatedContent(content?.content);
const displayValue = translatedText || t("fallbackKey");
```

### Regole per Nuove Feature
1. Prima di scrivere testo, aggiungere la chiave in `LanguageContext.tsx`
2. Aggiungere SEMPRE entrambe le traduzioni (it + en)
3. Usare chiavi semantiche: `wizardTitle`, `heroSubheadline`, non `text1`
4. Contenuti admin possono restare in italiano (interfaccia interna)
5. **Contenuti da DB**: SEMPRE passare attraverso `useTranslatedContent()`

### Contenuti che NON richiedono traduzione
- Nomi propri (Pipo, Sicilia, nomi località)
- Admin panel (interfaccia interna)
- Console logs e messaggi sviluppatore

## Regole per AI Future
1. Prima di modificare layout, verificare questo file
2. Le strutture qui documentate sono LOCKED
3. Nuove feature devono integrarsi senza rompere l'esistente
4. In caso di dubbio, chiedere conferma all'utente
5. MAI rimuovere o modificare la configurazione auto-update PWA
6. MAI disabilitare skipWaiting o clientsClaim
7. OGNI nuovo testo utente DEVE usare il sistema `t()` o `useTranslatedContent()`
8. MAI hardcodare testo italiano/inglese nei componenti
9. OGNI contenuto frontend DEVE essere sincronizzato con il backend (vedi `.knowledge/structure/backend-sync-principle.md`)
