

## Piano: Tradurre "Scorri" con il sistema multilingua

La scritta "Scorri" sulla riga 163 di `HeroSection.tsx` è hardcoded in italiano. Va aggiunta al sistema di traduzione.

### Modifiche

1. **`src/contexts/LanguageContext.tsx`** — Aggiungere chiave `scrollDown`:
   - IT: `"Scorri"`
   - EN: `"Scroll"`

2. **`src/components/HeroSection.tsx`** — Riga 163: sostituire `"Scorri"` con `t("scrollDown")`

