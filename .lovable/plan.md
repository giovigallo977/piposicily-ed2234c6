

## Ristrutturazione Landing Page

### Nuova struttura (dall'alto in basso)

```text
┌─────────────────────────────┐
│      HERO (invariato)       │
│  headline + subtitle + CTA  │
│       scroll indicator      │
└─────────────────────────────┘
          ↓ scroll
┌─────────────────────────────┐
│  "Scegli come vuoi vivere   │
│      la giornata"           │
│                             │
│  ┌──────┐    ┌──────┐       │
│  │ 🚗   │    │ 🚐   │       │
│  │ Fai   │    │ Non  │       │
│  │ da    │    │ vuoi │       │
│  │ solo  │    │ org. │       │
│  │       │    │      │       │
│  │ CTA   │    │ CTA  │       │
│  └──────┘    └──────┘       │
└─────────────────────────────┘
          ↓ scroll
┌─────────────────────────────┐
│  "Vuoi solo curiosare?"     │
│                             │
│  griglia categorie 2x2+2   │
│  (Luoghi, Collezioni,      │
│   Natura, Borghi, Arte,     │
│   Free Spots)               │
└─────────────────────────────┘
          ↓
│  Contact CTA Instagram     │
│  Mission Section            │
```

### Modifiche file per file

#### 1. `src/contexts/LanguageContext.tsx`
Aggiungere chiavi di traduzione IT/EN:
- `chooseDayTitle`: "Scegli come vuoi vivere la giornata" / "Choose how you want to spend your day"
- `selfTripTitle`: "Fai da solo (ma senza sbagliare)" / "Do it yourself (without mistakes)"
- `selfTripCta`: "Vedi gli itinerari pronti" / "See ready itineraries"
- `experienceTitle`: "Non vuoi organizzare nulla" / "Don't want to organize anything"
- `experienceCta`: "Unisciti a un'esperienza" / "Join an experience"
- `browseTitle`: "Vuoi solo curiosare?" / "Just want to browse?"
- `experienceFakeDoorTitle`: "Le Experience Pipo stanno arrivando!" / "Pipo Experiences are coming!"
- `experienceFakeDoorDesc`: "Stiamo lanciando le prime experience in piccoli gruppi.\nLascia la tua email: ti scriviamo appena apriamo le date." / "We're launching the first small-group experiences.\nLeave your email: we'll write you when dates open."
- `experienceFakeDoorCta`: "Voglio essere avvisato" / "Notify me"
- `experienceFakeDoorSuccess`: "Perfetto! Ti avviseremo presto." / "Great! We'll notify you soon."

#### 2. Database: nuova tabella `experience_waitlist`
Migrazione SQL per creare tabella con:
- `id` (uuid PK)
- `email` (text, not null)
- `created_at` (timestamptz, default now())
- RLS: insert aperto a tutti (anon + authenticated), select solo admin

#### 3. `src/components/HeroSection.tsx`
Riorganizzare il contenuto sotto la hero in 3 sezioni ordinate:

**Sezione 1 - "Scegli come vuoi vivere la giornata"**
- Titolo centrato
- Due card affiancate (grid 2 colonne):
  - Card 1: emoji auto, titolo "Fai da solo", CTA bottone → naviga a `/collezioni`
  - Card 2: emoji bus, titolo "Non vuoi organizzare nulla", CTA bottone → apre modal fake door

**Sezione 2 - "Vuoi solo curiosare?"**
- Titolo centrato
- Griglia categorie esistente (spostata qui, invariata)

**Sezione 3** - Contact CTA + Mission (invariati, restano in fondo)

#### 4. Nuovo componente `src/components/ExperienceWaitlistModal.tsx`
Dialog/modal con:
- Titolo e descrizione tradotti
- Campo email con validazione
- Bottone "Voglio essere avvisato"
- Insert in tabella `experience_waitlist` via Supabase
- Toast di conferma dopo l'invio

### Note tecniche
- La card "Vedi gli itinerari pronti" punta a `/collezioni` (Day Trip e Day Walk)
- La card "Unisciti a un'esperienza" apre un modal (fake door) con raccolta email
- Nessun contenuto esistente viene eliminato, solo riordinato
- Tutti i testi passano per `t()` (IT/EN)

