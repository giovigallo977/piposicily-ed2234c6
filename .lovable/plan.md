

# Collezioni - Sistema di Collezioni con Hotspot

## Cosa faremo

Creeremo un sistema completo di **Collezioni**: ogni collezione sara una card (simile a quelle delle categorie nella landing) con un nome e un'immagine. Cliccando su una collezione, si vedranno gli hotspot collegati a quella collezione.

## Struttura

### 1. Database - Nuove tabelle

**Tabella `collections`**:
- `id` (uuid, chiave primaria)
- `nome` (testo, nome della collezione)
- `descrizione` (testo, opzionale)
- `immagine` (testo, URL immagine copertina)
- `ordine` (intero, per ordinamento)
- `created_at`, `updated_at`

**Tabella `collection_hotspots`** (tabella ponte):
- `id` (uuid)
- `collection_id` (riferimento a collections)
- `hotspot_id` (riferimento a hotspots)
- `ordine` (intero, ordine dell'hotspot dentro la collezione)
- `created_at`

Entrambe le tabelle avranno:
- Lettura pubblica (come gli hotspot)
- Scrittura/modifica/eliminazione solo per utenti autenticati

### 2. Frontend - Pagina Collezioni

**Nuova pagina `/collezioni`**: mostrera le card delle collezioni in griglia.

**Nuova pagina `/collezioni/:id`**: mostrera gli hotspot appartenenti alla collezione selezionata, usando le stesse HotspotCard della pagina Esplora.

**Landing page**: il bottone "Collezioni" nella homepage puntera a `/collezioni` invece che filtrare per categoria.

### 3. Admin Panel - Gestione Collezioni

Nuovo tab **"Collezioni"** nel pannello admin con:
- Creare/modificare/eliminare collezioni (nome, descrizione, immagine)
- Associare hotspot esistenti a ogni collezione tramite selezione multipla (checkbox)
- Riordinare le collezioni

---

## Dettagli Tecnici

### Migrazione SQL

```sql
-- Tabella collections
CREATE TABLE public.collections (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nome text NOT NULL,
  descrizione text DEFAULT '',
  immagine text DEFAULT '',
  ordine integer DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Tabella ponte collection_hotspots
CREATE TABLE public.collection_hotspots (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  collection_id uuid NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
  hotspot_id uuid NOT NULL REFERENCES public.hotspots(id) ON DELETE CASCADE,
  ordine integer DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(collection_id, hotspot_id)
);

-- RLS
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_hotspots ENABLE ROW LEVEL SECURITY;

-- Policies collections
CREATE POLICY "Collections are publicly readable" ON public.collections FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert collections" ON public.collections FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update collections" ON public.collections FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can delete collections" ON public.collections FOR DELETE USING (auth.uid() IS NOT NULL);

-- Policies collection_hotspots
CREATE POLICY "Collection hotspots are publicly readable" ON public.collection_hotspots FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert collection hotspots" ON public.collection_hotspots FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update collection hotspots" ON public.collection_hotspots FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can delete collection hotspots" ON public.collection_hotspots FOR DELETE USING (auth.uid() IS NOT NULL);

-- Trigger updated_at
CREATE TRIGGER update_collections_updated_at BEFORE UPDATE ON public.collections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
```

### Nuovi file

| File | Scopo |
|------|-------|
| `src/hooks/useCollections.ts` | Hook CRUD per collections e collection_hotspots |
| `src/pages/CollectionsPage.tsx` | Pagina lista collezioni |
| `src/pages/CollectionDetailPage.tsx` | Pagina dettaglio con hotspot della collezione |

### File modificati

| File | Modifica |
|------|----------|
| `src/App.tsx` | Aggiungere route `/collezioni` e `/collezioni/:id` |
| `src/pages/Admin.tsx` | Nuovo tab "Collezioni" con CRUD e selezione hotspot |
| `src/components/HeroSection.tsx` | Il click su "Collezioni" punta a `/collezioni` |

### Flusso utente

1. **Admin** crea una collezione (nome + immagine) e seleziona gli hotspot da includere
2. **Landing page**: card "Collezioni" porta a `/collezioni`
3. **Pagina Collezioni**: griglia di card collezione (stile simile alle categorie)
4. **Click su collezione**: pagina con gli hotspot di quella collezione, usando le stesse HotspotCard
