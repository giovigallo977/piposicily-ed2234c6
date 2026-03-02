

## Piano: Uniformare stili subtitle e CTA text

### Problema
- Il subtitle ("Luoghi nascosti...") ha `text-base font-medium` — troppo piccolo e leggero
- Il CTA ("Una guida per perdersi...") ha `text-lg font-bold italic` — bold ma in corsivo

### Fix in `src/components/HeroSection.tsx`

**Riga 152 (subtitle):** cambiare da `text-base font-medium` a `text-lg font-bold` — stesso peso e dimensione del CTA

**Riga 157 (CTA text):** rimuovere `italic` dalla classe, mantenendo `text-lg font-bold`

Risultato: entrambi i testi saranno `text-lg font-bold` senza corsivo.

