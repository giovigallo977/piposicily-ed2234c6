

## Aggiornare copy della card "Fai da solo"

### Cosa cambia
Aggiornare titolo, sottotitolo e CTA della card "Fai da solo" nella sezione decisionale della homepage.

### Modifiche

**File: `src/contexts/LanguageContext.tsx`**

Italiano (riga 99-100):
- `selfTripTitle`: `"Fai da solo\n(ma senza sbagliare)"` → `"Esplora senza sbagliare\nItinerari già pronti, zero tempo perso"`
- `selfTripCta`: `"Vedi gli itinerari pronti"` → `"Vedi dove puoi andare!"`

English (riga 198-199):
- `selfTripTitle`: `"Do it yourself\n(without mistakes)"` → `"Explore without mistakes\nReady itineraries, zero wasted time"`
- `selfTripCta`: `"See ready itineraries"` → `"See where you can go!"`

**File: `src/components/HeroSection.tsx`** — Rimuovere l'emoji 🚗 e sostituire con nulla (o mantenerla se preferisci). Nessuna altra modifica strutturale necessaria.

