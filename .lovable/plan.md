

## Piano: Analytics minimale MVP

### Database
Creare una tabella `analytics_events` con 3 colonne:
- `id` (uuid, PK)
- `event_type` (text) — valori: `page_view`, `hotspot_view`, `payment_click`
- `created_at` (timestamptz, default now())

RLS: INSERT aperto a tutti (anon + authenticated), SELECT solo authenticated.

### Tracciamento eventi (3 punti di inserimento)

1. **`src/pages/Index.tsx`** — `useEffect` al mount: inserisce `page_view`
2. **`src/components/HotspotCard.tsx`** — quando `isExpanded` diventa `true`: inserisce `hotspot_view`
3. **`src/components/PremiumModal.tsx`** — dentro `handlePay`: inserisce `payment_click`

Ogni inserimento è un semplice `supabase.from("analytics_events").insert({ event_type: "..." })` fire-and-forget (no await, no error handling — non deve bloccare l'UX).

### Pagina admin analytics

**`src/pages/AdminAnalytics.tsx`** — pagina protetta (stesso check auth di `/admin`):
- Query: `SELECT event_type, count(*) FROM analytics_events GROUP BY event_type`
- Mostra 3 card con i conteggi: Page Views, Hotspot Views, Payment Clicks
- Link di ritorno a `/admin`

**`src/App.tsx`** — aggiungere route `/admin-analytics`

### Nessuna modifica a
- Logica business, auth, premium, collezioni, free spots
- Nessun cookie, nessun servizio esterno

