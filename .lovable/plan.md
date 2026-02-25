

# Piano: Semplificare Free Spots (rimuovere categorie, solo lista piatta)

## Situazione attuale

- La **copertina** della card "Free Spots" in homepage e gia gestibile dall'admin (campo `cat_image_free_spots` nella sezione "Immagini Categorie" dell'admin). Questo funziona gia.
- La pagina `/free-spots` ha filtri per sotto-categorie (Lavorare, Studiare, Eat & Drink) e mostra immagini di categoria dalla tabella `free_spot_categories`. Tu non vuoi queste sotto-categorie.
- L'admin Free Spots ha una sezione "Immagini Categorie" e un campo "Categoria" nel form dello spot. Non servono.

## Cosa cambia

Rimuovere tutto il sistema di sotto-categorie dai Free Spots. Gli spot si aggiungono e si vedono in una lista semplice, esattamente come gli hotspot nelle altre categorie (Arte e Cultura, Natura, ecc.).

## Modifiche

### 1. `src/pages/FreeSpotsPage.tsx`
- Rimuovere i filtri chip (Tutti, Lavorare, Studiare, Eat & Drink)
- Rimuovere l'import e l'uso di `useFreeSpotCategories`
- Rimuovere l'header immagine categoria
- Mostrare tutti i free spots in una lista piatta senza filtri

### 2. `src/components/AdminFreeSpotsTab.tsx`
- Rimuovere la sezione "Immagini Categorie" in cima
- Rimuovere il campo Select "Categoria" dal form di creazione/modifica spot
- Rimuovere l'import di `useFreeSpotCategories` e `useUpdateFreeSpotCategory`
- Rimuovere la costante `FREE_SPOT_CATEGORIES`

### 3. Nessuna modifica al database
La tabella `free_spot_categories` resta nel database (non da fastidio) ma non viene piu usata dal codice. La colonna `categoria` nella tabella `free_spots` resta ma non viene piu mostrata nel form.

### 4. Nessuna modifica all'admin homepage
L'upload della copertina della card "Free Spots" in homepage e gia presente nell'admin principale (sezione immagini categorie) e funziona correttamente tramite `site_content`.

