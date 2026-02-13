

# Piano: Admin completo per foto categorie, testi hero e missione

## Panoramica

Aggiornare il pannello Admin per permettere di gestire:
1. Le foto delle 5 schede homepage (Luoghi Fantasma, Natura, Borghi, Arte e Cultura, Collezioni)
2. I testi Hero (headline, sottotitolo, CTA)
3. Il testo completo della missione di Pipo

Attualmente le foto delle categorie vengono prese dal primo hotspot di quella categoria e il testo missione e hardcoded. Rendiamo tutto modificabile dall'admin.

---

## Modifiche tecniche

### 1. `src/pages/Admin.tsx` - Nuova sezione "Foto Categorie"

Aggiungere un terzo tab o una nuova Card nella sezione "Contenuti" con:

- **5 campi ImageUpload** per caricare le foto delle schede:
  - Luoghi Fantasma
  - Natura
  - Borghi
  - Arte e Cultura
  - Collezioni
- Ogni foto viene salvata come `site_content` con chiavi:
  - `cat_image_luoghi_fantasma`
  - `cat_image_natura`
  - `cat_image_borghi`
  - `cat_image_arte_cultura`
  - `cat_image_collezioni`
- Bottone "Salva Foto Categorie"

**Aggiornare la sezione "Testo Missione"**:
- Rendere i campi missione funzionali per il nuovo testo statico (gia presenti ma il frontend ora ignora il DB). I campi `mission` e `mission_part2` esistono gia nell'admin.

**Aggiungere campo CTA "Esplora gli itinerari"**:
- Nuovo campo per modificare il testo CTA sotto l'hero (attualmente hardcoded da `t("exploreCta")`)
- Chiave: `explore_cta_text`

### 2. `src/components/HeroSection.tsx` - Leggere foto e testi dal DB

**Foto categorie**: Leggere da `site_content` le chiavi `cat_image_*`. Se presenti, usare quelle; altrimenti fallback alle foto degli hotspot (comportamento attuale).

**Testo CTA**: Leggere `explore_cta_text` da `site_content`, fallback a `t("exploreCta")`.

**Testo Missione**: Leggere `mission` e `mission_part2` da `site_content`. Se presenti, renderizzare il contenuto dal DB (con supporto per andare a capo). Se vuoti, mantenere il testo hardcoded attuale come fallback.

### 3. Nuovi hook `useSiteContent` necessari

Nel HeroSection aggiungere:
```
useSiteContent("cat_image_luoghi_fantasma")
useSiteContent("cat_image_natura")
useSiteContent("cat_image_borghi")
useSiteContent("cat_image_arte_cultura")
useSiteContent("cat_image_collezioni")
useSiteContent("explore_cta_text")
useSiteContent("mission")
useSiteContent("mission_part2")
```

---

## File coinvolti

| File | Modifica |
|------|----------|
| `src/pages/Admin.tsx` | Aggiungere sezione foto categorie con 5 ImageUpload + campo CTA explore |
| `src/components/HeroSection.tsx` | Leggere foto categorie, CTA e missione dal DB con fallback |

## Cosa NON cambia

- La struttura della griglia 2x2 + Collezioni
- Il layout mobile-first
- I componenti ImageUpload e MultiImageUpload (gia esistenti)
- La tabella `site_content` nel database (usiamo le stesse colonne text per salvare URL immagini)

