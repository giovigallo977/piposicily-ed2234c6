

## Tracking Google Analytics: hotspot click + email submit

### Cosa cambia
Aggiungere chiamate `gtag()` native per inviare eventi a Google Analytics, oltre al tracking interno già esistente.

### 1. Dichiarazione TypeScript per `gtag`
**File: `src/vite-env.d.ts`** — Aggiungere la dichiarazione globale di `gtag` per evitare errori TypeScript.

### 2. Hotspot click → `gtag('event', 'hotspot_click', { label })`
**File: `src/components/HotspotCard.tsx`** — In `handleToggleExpand`, quando la card si espande, inviare:
```js
gtag('event', 'hotspot_click', { label: hotspot.categoria || hotspot.titolo });
```
Così ogni hotspot avrà una label diversa basata sulla categoria (es. "Luoghi Fantasma", "Natura", "Borghi").

### 3. Email gate submit → `gtag('event', 'email_submit')`
**File: `src/components/EmailGateModal.tsx`** — Dopo il successo di `signInWithOtp`, inviare:
```js
gtag('event', 'email_submit', { label: 'gate_modal' });
```

### 4. Experience waitlist submit → `gtag('event', 'email_submit')`
**File: `src/components/ExperienceWaitlistModal.tsx`** — Dopo l'insert riuscito, inviare:
```js
gtag('event', 'email_submit', { label: 'experience_waitlist' });
```

### Risultato
In Google Analytics → Realtime vedrai:
- **hotspot_click** con label per categoria
- **email_submit** con label per distinguere gate vs waitlist

