

# Piano: Titolo card Free Spots da backend

## Cosa cambia

1. Il testo della card Free Spots nella homepage diventa **"Free Spots"** come titolo principale e **"Work, Study & Eat&Drink"** come sottotitolo, entrambi modificabili dal backend tramite `site_content`.

2. Due nuove chiavi in `site_content`:
   - `cat_label_free_spots` → titolo (default: "Free Spots")
   - `cat_sublabel_free_spots` → sottotitolo (default: "Work, Study & Eat&Drink")

3. Nel componente `HeroSection.tsx`, il testo hardcoded viene sostituito con contenuto dal DB + traduzione automatica, seguendo il pattern già usato per le altre sezioni.

## Modifiche tecniche

### File: `src/components/HeroSection.tsx`

- Aggiungere due `useSiteContent` per le nuove chiavi
- Aggiungere due `useTranslatedContent` per la traduzione
- Nella card Free Spots, sostituire il testo fisso con due `<span>`: titolo in grassetto e sottotitolo più piccolo sotto

Layout della card:
```text
┌──────────────────┐
│                   │
│   [immagine]      │
│                   │
│  Free Spots       │  ← titolo (da DB)
│  Work, Study &    │  ← sottotitolo (da DB)
│  Eat&Drink        │
└──────────────────┘
```

### File: `src/pages/Admin.tsx`

- Nella sezione di gestione contenuti (dove si editano hero_headline, hero_subtitle ecc.), aggiungere due campi per `cat_label_free_spots` e `cat_sublabel_free_spots`, coerenti con gli altri campi già gestiti.

### Nessuna modifica al database

Le chiavi vengono create automaticamente al primo salvataggio dall'admin (il pattern `site_content` supporta upsert).

