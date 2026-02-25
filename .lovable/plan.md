

# Piano: Griglia homepage 2+2+2

## Cosa cambia

La card "Collezioni" attualmente è full-width (aspect 16:9) sotto la griglia 2x2. Va trasformata in una card quadrata (aspect-square) identica alle altre 4 categorie, e affiancata da una nuova card "Free Spots" anch'essa quadrata. Il risultato: una griglia uniforme 3 righe x 2 colonne.

```text
[Luoghi Fantasma]  [Natura]
[Borghi]           [Arte e Cultura]
[Collezioni]       [Free Spots]
```

La pagina Collezioni e il suo contenuto interno restano completamente invariati.

## Modifiche tecniche

### File: `src/components/HeroSection.tsx`

1. **Aggiungere** fetch immagine free spots: `useSiteContent("cat_image_free_spots")` con fallback a muted
2. **Rimuovere** il blocco separato "Collezioni Card" full-width (righe 167-193), incluse le grafiche decorative laterali (`decoCollLeft`, `decoCollRight`)
3. **Estendere la griglia** esistente (riga 140) aggiungendo dopo il `.map()` delle 4 categorie due card extra dentro lo stesso `grid grid-cols-2`:
   - Card "Collezioni" — aspect-square, stesse classi delle altre card, click naviga a `/collezioni`, immagine da `catImgCollezioni`
   - Card "Free Spots" — aspect-square, titolo "Lavorare, Studiare & Eat", click naviga a `/collezioni` (dove la sezione free spots è già presente), immagine da `cat_image_free_spots`
4. **Pulizia**: rimuovere import/fetch di `decoCollLeft` e `decoCollRight` dato che non servono piu nella card quadrata

### Nessun altro file modificato

- La pagina Collezioni resta invariata con collezioni + sezione free spots
- Nessuna modifica al database o agli hook

