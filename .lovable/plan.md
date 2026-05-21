## Modifica sezione "Curiosare" della Homepage

### Cosa cambia (in `src/components/HeroSection.tsx`)

Nella sezione "Browse / Curiosare" (sotto l'hero), sostituire titolo + sottotitolo + griglia categorie sempre visibile con:

1. **Titolo**: "Decidi come esplorare" (al posto di "Vuoi solo curiosare?" + "Esplora gli spot di Pipo...")
2. **Due CTA affiancate** (grid 2 colonne, stile coerente con i bottoni esistenti):
   - **Sinistra — "Esplora in libertà"** → naviga a `/esplora` (mostra tutti gli hotspot, senza filtro categoria, in un'unica pagina — funzionalità già supportata da `ExplorePage`)
   - **Destra — "Esplora per categoria"** → toggle che mostra/nasconde sotto le 5 schede categorie attuali (Luoghi Fantasma, Natura, Borghi, Arte e Cultura, Free Spots). Di default le schede sono nascoste e compaiono solo dopo il click.

### Dettagli tecnici

- Aggiungere uno stato locale `showCategories` in `HeroSection` per il toggle.
- Le schede categorie (codice esistente `<CategoryCard>` + bottone Free Spots) restano invariate, solo condizionate da `showCategories`.
- Aggiornare i testi in `src/contexts/LanguageContext.tsx`:
  - Sostituire `browseTitle` → "Decidi come esplorare" / "Choose how to explore"
  - Rimuovere/svuotare `browseSubtitle`
  - Aggiungere `exploreFreelyCta` ("Esplora in libertà" / "Explore freely") e `exploreByCategoryCta` ("Esplora per categoria" / "Explore by category")
- Nessuna modifica al database o ad altre pagine.

### Fuori scope

- Nessuna modifica a stile globale, categorie, o `ExplorePage`.
- I testi `browseTitle`/`browseSubtitle` in Admin (se editabili) restano funzionanti; aggiornerò solo le stringhe di default i18n.
