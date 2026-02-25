

# Fix contrasto badge "GRATUITO" e "Sblocca tutto"

Il problema è che i badge usano `bg-primary text-primary-foreground` dove `--primary` è un giallo-verde chiaro (HSL 72 96% 62%) e `--primary-foreground` è bianco — contrasto pessimo.

## Modifiche

### 1. Badge "GRATUITO" in `HotspotCard.tsx` (riga 90)
- Da: `bg-primary text-primary-foreground` (giallo chiaro + bianco)
- A: `bg-olive text-white` (verde Pipo #52C471 + testo bianco — leggibile)

### 2. Badge "PREMIUM" overlay in `HotspotCard.tsx` (riga 82)
- Verifico che sia già leggibile (usa `text-background` su sfondo scuro — ok)

### 3. Banner "Sblocca tutto" in `ExplorePage.tsx` (riga 105)
- Da: `text-primary` (giallo chiaro, illeggibile)
- A: `text-olive font-bold` (verde Pipo, leggibile)

### 4. Icona Sparkles nel banner (riga 100)
- Da: `text-primary`
- A: `text-olive`

### 5. Badge "Membro Premium" in header (riga 68)
- Da: `bg-primary text-primary-foreground`
- A: `bg-olive text-white`

Tutti i badge passeranno dal giallo-verde chiaro al verde Pipo (`--olive: 138 52% 55%`) con testo bianco, garantendo un contrasto forte e leggibile.

