

## Situazione attuale

1. **Pagina Analytics**: Esiste come route `/admin-analytics` con il componente `AdminAnalytics.tsx`, **ma non c'è nessun link nel pannello Admin** che punti ad essa. È raggiungibile solo digitando l'URL manualmente.

2. **Sezione Grafiche Decorative**: Presente nel tab "Contenuti del Sito" del pannello Admin (righe 894-957), con 4 upload per i doodle hero + handler `handleSaveDecoGraphics` + state e hook correlati.

## Piano

### 1. Aggiungere link ad Analytics nel pannello Admin
- Aggiungere un pulsante/link nel pannello Admin (ad esempio nell'header accanto al pulsante Logout) che naviga a `/admin-analytics`

### 2. Rimuovere la sezione Grafiche Decorative dal backend
In `src/pages/Admin.tsx`:
- Rimuovere i 4 `useSiteContent` per `deco_hero_*` (righe 66-69)
- Rimuovere i 4 state `decoHeroLT/LB/RT/RB` (righe 92-95)
- Rimuovere le inizializzazioni nel `useEffect` (righe 125-128) e i riferimenti nella dependency array (righe 141-142)
- Rimuovere la funzione `handleSaveDecoGraphics` (righe 241-246)
- Rimuovere il blocco JSX della card "Grafiche Decorative" (righe 894-957)

Nessuna modifica ai componenti frontend che *usano* le grafiche decorative (HeroSection) — restano visibili, solo non più editabili dal pannello admin.

