

# Piano: Immagini per le categorie Free Spots

## Obiettivo
Permettere di caricare un'immagine per ogni categoria dei Free Spots (Lavorare, Studiare, Eat & Drink) dal pannello admin, e salvarla nel backend.

## Approccio
Creare una nuova tabella `free_spot_categories` nel database con campi `nome` (chiave unica) e `immagine` (URL). Questo approccio e piu pulito rispetto a usare `site_content` perche permette di gestire le categorie come entita strutturate (e in futuro aggiungerne di nuove).

## Modifiche

### 1. Database: nuova tabella `free_spot_categories`
```sql
CREATE TABLE public.free_spot_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text UNIQUE NOT NULL,
  immagine text DEFAULT '',
  ordine integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.free_spot_categories ENABLE ROW LEVEL SECURITY;

-- Lettura pubblica
CREATE POLICY "Free spot categories are publicly readable"
  ON public.free_spot_categories FOR SELECT USING (true);

-- CRUD per utenti autenticati (admin)
CREATE POLICY "Authenticated users can update free spot categories"
  ON public.free_spot_categories FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can insert free spot categories"
  ON public.free_spot_categories FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Seed iniziale con le 3 categorie
INSERT INTO public.free_spot_categories (nome, ordine) VALUES
  ('Lavorare', 1),
  ('Studiare', 2),
  ('Eat & Drink', 3);
```

### 2. Nuovo hook `src/hooks/useFreeSpotCategories.ts`
- `useFreeSpotCategories()` -- query per leggere le categorie con immagine
- `useUpdateFreeSpotCategory()` -- mutation per aggiornare l'immagine

### 3. Sezione nell'admin `AdminFreeSpotsTab.tsx`
- Aggiungere una sezione "Categorie" sopra la lista degli spot
- Per ogni categoria: mostra nome + campo ImageUpload per caricare/cambiare la foto
- Usa il bucket `hotspot-images` gia esistente

### 4. Frontend `FreeSpotsPage.tsx`
- Leggere le categorie dal database
- Mostrare l'immagine della categoria accanto ai filtri chip (o come header della sezione filtrata)

## Dettagli tecnici
- Il bucket `hotspot-images` e gia pubblico e pronto per l'uso
- Le categorie vengono pre-inserite con il seed, quindi l'admin deve solo caricare le foto
- Il componente `ImageUpload` gia esistente gestisce upload e preview

