

## Obiettivo

Rinominare "Collezioni" in "Day Trip e Day Walk" ovunque sia visibile all'utente.

## Modifiche

### 1. `src/contexts/LanguageContext.tsx`
- IT: `collections: "Collezioni"` → `"Day Trip e Day Walk"`
- EN: `collections: "Collections"` → `"Day Trip & Day Walk"`
- Aggiornare anche i testi correlati (`noCollections`, `collection`) per coerenza

### 2. `src/components/HeroSection.tsx`
- La card "Collezioni" nella griglia usa `t("collections")` — prenderà automaticamente il nuovo nome

### 3. `src/pages/CollectionsPage.tsx`
- Il titolo header usa `t("collections")` — prenderà automaticamente il nuovo nome

### 4. `src/pages/Admin.tsx` (solo label interne admin)
- Aggiornare i testi hardcoded come `"Collezioni"` nelle label dell'admin panel per coerenza

Nessuna modifica al database o alle rotte (gli URL restano `/collezioni/...`).

