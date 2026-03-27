

## Obiettivo

Rimuovere la card "Day Trip e Day Walk" dalla griglia categorie nella sezione "Vuoi solo curiosare?", dato che gli itinerari sono già raggiungibili dalla CTA "Fai da solo → Vedi gli itinerari pronti". La griglia passa da 6 card (3 righe) a 5 card (pattern 2+2+1 o 2+2+2 con Free Spots che sale).

Nessuna modifica al backend: la pagina `/collezioni` e la gestione Day Trip e Day Walk nell'admin restano invariate. Cambia solo la homepage.

## Modifiche

### `src/components/HeroSection.tsx`
- Rimuovere il blocco button che renderizza la card "Collezioni" (righe 254-265) dalla griglia categorie
- Rimuovere le variabili inutilizzate: `catImgCollezioni`, `collezioniImage` e relativo `useMemo`
- La griglia diventa: Luoghi Fantasma, Natura, Borghi, Arte e Cultura, Free Spots (5 card, 2+2+1)

### Cleanup
- Rimuovere l'import/fetch di `catImgCollezioni` da `useSiteContent("cat_image_collezioni")` dato che non serve più

Nessuna modifica al database, alle rotte, o al pannello admin.

