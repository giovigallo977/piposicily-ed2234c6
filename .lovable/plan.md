

## Cambio di rotta: 2 Landing Page MVP per validazione email

### Cosa si fa

Creare 2 nuove pagine landing minimal, mobile-first, con unico obiettivo: raccolta email. La homepage (`/`) diventa un selettore tra le due landing, oppure possiamo usare rotte dedicate.

### Struttura routing

- `/` — Homepage con 2 card che portano alle due landing
- `/self-guided` — Landing 1 (itinerari in autonomia)
- `/experience` — Landing 2 (experience guidate)
- Le rotte admin/auth restano invariate
- Le rotte esistenti (`/esplora`, `/collezioni`, ecc.) restano ma non sono linkate dalle landing

### Landing 1 — Self Guided (`/self-guided`)

**Hero**: Titolo + sottotitolo su sfondo pulito
**Esempi**: 3 card minimal (Palermo Liberty, Palermo Graffiti, Palermo Araba) con solo nome + 1 riga
**Value prop**: Testo breve
**CTA Email**: Campo email + bottone "Avvisami" + microcopy anti-spam
**CTA ripetuta** in fondo alla pagina

Email salvata nella tabella `experience_waitlist` con un campo `source` per distinguere. Serve una migrazione per aggiungere `source` a `experience_waitlist`.

### Landing 2 — Experience (`/experience`)

**Hero**: Titolo + sottotitolo
**Esempi**: 3 card (Valle del Belice, Bosco della Ficuzza, Piano Battaglia)
**Value prop**: Testo breve
**CTA Email**: Campo email + bottone "Avvisami quando aprono" + microcopy
**CTA ripetuta** in fondo

Email salvata nella stessa tabella con `source = 'experience'`.

### Migrazione DB

```sql
ALTER TABLE public.experience_waitlist
  ADD COLUMN source text DEFAULT 'experience';
```

### Tracking

Ogni landing traccia:
- `page_view` (con parametro per distinguere quale landing)
- `email_submit` su invio email
- Google Analytics `gtag` event su submit

### File nuovi

- `src/pages/SelfGuidedLanding.tsx` — Landing completa self-guided
- `src/pages/ExperienceLanding.tsx` — Landing completa experience guidate
- `src/components/EmailCaptureForm.tsx` — Componente riutilizzabile per il form email (usato da entrambe le landing)

### File modificati

- `src/App.tsx` — Aggiungere rotte `/self-guided` e `/experience`
- `src/pages/Index.tsx` — Ridisegnare come selettore minimal con 2 card che portano alle landing
- `src/lib/trackEvent.ts` — Aggiungere event type per le landing

### Design

- Mobile first, nessun menu complesso
- Font Inter/Nunito già disponibili
- Colori: sfondo bianco, testo scuro, CTA giallo (`--cta-yellow` già nel design system)
- Nessuna distrazione: no header complesso, no footer, solo logo Pipo minimal in alto
- Scroll fluido, sezioni ben spaziate

### Admin

Nella tab Email dell'admin, le email saranno visibili con la source (`self_guided` o `experience`) per capire da dove arrivano.

