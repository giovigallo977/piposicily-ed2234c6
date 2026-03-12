

## Riordinare la griglia categorie in HeroSection

Attualmente l'ordine nella griglia 2x2 è:
```text
Luoghi Fantasma  |  Natura
Borghi           |  Arte e Cultura
Collezioni       |  Free Spots
```

Nuovo ordine richiesto:
```text
Luoghi Fantasma  |  Collezioni
Natura           |  Borghi
Arte e Cultura   |  Free Spots
```

### Modifica in `src/components/HeroSection.tsx`

La griglia attualmente renderizza prima il loop `CATEGORIES` (4 card) poi Collezioni e Free Spots come card separate. Per ottenere il nuovo ordine, bisogna smontare il loop e renderizzare le 6 card in ordine esplicito:

1. **Luoghi Fantasma** (da CATEGORIES)
2. **Collezioni** (card statica, spostata qui)
3. **Natura** (da CATEGORIES)
4. **Borghi** (da CATEGORIES)
5. **Arte e Cultura** (da CATEGORIES)
6. **Free Spots** (card statica, resta ultima)

Approccio: sostituire il `CATEGORIES.map()` + le due card statiche con 6 card renderizzate nell'ordine esatto. Ogni card mantiene lo stesso markup attuale, cambia solo la posizione nel JSX.

Un solo file toccato: `src/components/HeroSection.tsx`, righe 186-251.

