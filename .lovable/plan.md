

## Piano: Centrare testi hero + fix contrasto bottone

### File: `src/components/HeroSection.tsx`

**1. Centrare tutti i testi (anche su mobile)**
- Riga 135: headline da `text-left md:text-center` → `text-center`
- Riga 140: subtitle da `text-left md:text-center` → `text-center`

**2. Fix contrasto bottone "Sblocca Pipo a 4,99€"**
- Riga 152: cambiare da `bg-primary text-primary-foreground` (bianco su lime verde brillante, poco leggibile) a `bg-foreground text-background` (testo chiaro su sfondo scuro, massimo contrasto) oppure usare il verde Pipo scuro `bg-olive text-white` che ha contrasto garantito (come da design principles)
- Approccio consigliato: `bg-foreground text-background` per massima leggibilità, con `hover:bg-foreground/90`

