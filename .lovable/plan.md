

## Migliorare il layout delle card decisionali su mobile

### Problema
Le due card ("Esplora senza sbagliare..." e "Non vuoi organizzare nulla?...") usano una griglia 2 colonne fissa. Su schermi piccoli il testo lungo si comprime troppo, i bottoni CTA si stringono e il layout risulta sbilanciato.

### Soluzione
Passare da `grid-cols-2` fisso a **una colonna su mobile, due colonne su tablet/desktop**. Ridurre il padding interno su mobile e migliorare la leggibilità.

### Modifiche

**File: `src/components/HeroSection.tsx`** (sezione Decision cards, ~riga 196)

- Griglia: `grid grid-cols-2 gap-3` → `grid grid-cols-1 sm:grid-cols-2 gap-3`
- Padding card: `p-5` → `p-4 sm:p-5`
- Emoji: ridurre da `text-3xl` a `text-2xl` su mobile
- Testo titolo card: aggiungere `text-xs sm:text-sm md:text-base` per scalare meglio
- Bottone CTA: mantenere `w-full`, verificare che `text-xs` sia leggibile

Risultato: su mobile le due card si impilano in verticale, occupano tutta la larghezza e il testo ha spazio sufficiente. Su schermi >= 640px tornano affiancate.

