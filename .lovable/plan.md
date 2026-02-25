

# Piano: Sezione "Posti per..." sempre gratuita nelle Collezioni

## Concetto

Aggiungere una nuova sezione nella pagina Collezioni dedicata a locali e posti utili (lavorare, studiare, eat&drink), con schede identiche alle HotspotCard ma **sempre gratuite** (nessun lucchetto, nessun controllo premium).

## Approccio tecnico

### 1. Nuova tabella database: `free_spots`

Creare una tabella separata dagli hotspots per questi posti gratuiti, con struttura simile ma semplificata:

```sql
CREATE TABLE public.free_spots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titolo text NOT NULL,
  descrizione_breve text NOT NULL DEFAULT '',
  descrizione_completa text NOT NULL DEFAULT '',
  foto_principale text DEFAULT '',
  foto_gallery text[] DEFAULT ARRAY[]::text[],
  link_google_maps text DEFAULT '',
  categoria text DEFAULT '', -- "Lavorare", "Studiare", "Eat & Drink"
  zona text DEFAULT '',
  tags text[] DEFAULT ARRAY[]::text[],
  ordine integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- RLS: lettura pubblica, scrittura autenticata
ALTER TABLE public.free_spots ENABLE ROW LEVEL SECURITY;
-- SELECT pubblica
-- INSERT/UPDATE/DELETE per autenticati
```

Motivo per tabella separata: evita di mischiare logiche di locking/premium con contenuti sempre gratuiti. Struttura identica a `hotspots` per poter riusare `HotspotCard`.

### 2. Hook: `src/hooks/useFreeSpots.ts`

Hook con le stesse operazioni CRUD di `useHotspots` ma sulla tabella `free_spots`. Query key: `["free-spots"]`.

### 3. Pagina CollectionsPage — Sezione "Posti per..."

Sotto la griglia collezioni esistente, aggiungere:

- Titolo sezione: "Posti per: Lavorare, Studiare e Eat & Drink"
- Filtri a chip per categoria: Tutti | Lavorare | Studiare | Eat & Drink
- Griglia di `HotspotCard` con `locked={false}` e senza badge free/premium

Il layout sarà coerente con il resto dell'app.

### 4. Admin — Nuovo tab "Free Spots"

Aggiungere un tab nel pannello admin per gestire i free spots con lo stesso form usato per gli hotspots (titolo, descrizione, foto, categoria con opzioni predefinite: Lavorare, Studiare, Eat & Drink).

### 5. File modificati

| File | Modifica |
|------|----------|
| **Migrazione SQL** | Nuova tabella `free_spots` con RLS |
| `src/hooks/useFreeSpots.ts` | **Nuovo** — CRUD hook |
| `src/pages/CollectionsPage.tsx` | Aggiunta sezione free spots con filtri |
| `src/pages/Admin.tsx` | Nuovo tab "Free Spots" con form CRUD |

### 6. Flusso visuale nella pagina Collezioni

```text
┌─────────────────────────────┐
│  ← Collezioni         🔑   │  header
├─────────────────────────────┤
│  [Collezione 1] [Coll. 2]  │  griglia collezioni
│  [Collezione 3] [Coll. 4]  │  (esistente, invariata)
├─────────────────────────────┤
│                             │
│  Posti per: Lavorare,       │  titolo sezione
│  Studiare e Eat & Drink     │
│                             │
│  [Tutti] [Lavorare]         │  filtri chip
│  [Studiare] [Eat & Drink]   │
│                             │
│  ┌─────────────────────┐    │
│  │ HotspotCard (free)  │    │  schede sempre sbloccate
│  └─────────────────────┘    │
│  ┌─────────────────────┐    │
│  │ HotspotCard (free)  │    │
│  └─────────────────────┘    │
└─────────────────────────────┘
```

### 7. Riuso di HotspotCard

I dati `free_spots` hanno la stessa struttura di `Hotspot`, quindi `HotspotCard` funziona senza modifiche — basta passare `locked={false}` e omettere `isFree`/`onLockedClick`.

