

## Check PWA: Stato attuale e problemi trovati

Ho analizzato tutta l'app. Ecco il report.

### Cosa funziona bene
- **PWA config**: `vite-plugin-pwa` configurato correttamente con `skipWaiting`, `clientsClaim`, auto-update ogni 30s, check su visibility/focus/pageshow
- **Manifest**: corretto, con icone, orientamento portrait, display standalone
- **Caching**: strategia sensata (NetworkFirst per API/HTML, CacheFirst per immagini)
- **Responsive grid**: le card usano `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`, la homepage ha `max-w-lg` per le categorie — si adatta bene
- **Traduzione**: sistema `t()` usato quasi ovunque
- **Analytics**: funzionante, fire-and-forget

### Problemi trovati

#### 1. Bug font-family: virgoletta spuria in Tailwind config
In `tailwind.config.ts` riga 29 e 45:
```
'Rubik Bubbles"'  // ← la virgoletta doppia finale è un errore
```
Dovrebbe essere `'"Rubik Bubbles"'` (con virgoletta di apertura) oppure semplicemente `'Rubik Bubbles'`. Attualmente genera un nome font invalido.

#### 2. Manifest duplicato
C'è sia `public/manifest.json` (statico) sia il manifest generato da `vite-plugin-pwa`. Sono identici ma il file statico è inutile e potrebbe creare confusione. L'`index.html` linka quello statico (riga 40), ma il plugin PWA inietta il suo. Meglio rimuovere `public/manifest.json` e il `<link rel="manifest">` da `index.html` — il plugin lo gestisce da solo.

#### 3. OG URLs puntano al vecchio dominio
In `index.html`:
- `og:url` → `https://pipo2.lovable.app/` (vecchio)
- `canonical` → `https://pipo2.lovable.app/` (vecchio)

Dovrebbero puntare a `https://piposicily.lovable.app/`

#### 4. Righe vuote inutili in `index.html`
Righe 46-59: circa 14 righe vuote — pulizia.

#### 5. Testo hardcoded in FreeSpotsPage
- Riga 58: `"Nessun free spot ancora."` non usa `t()` — viola la regola multilingua.

#### 6. `navigateFallbackDenylist: [/./]`
Questo regex nega il fallback per TUTTE le rotte (blocca `navigateFallback`). È corretto solo se vuoi NetworkFirst puro per la navigazione (che hai configurato nel runtimeCaching). Non è un bug ma è ridondante col caching di navigazione già presente.

#### 7. AdminAnalytics: query non scalabile
La pagina scarica TUTTE le righe di `analytics_events` e conta client-side. Con la crescita, supererà il limite di 1000 righe e mostrerà conteggi sbagliati. Meglio usare una query SQL aggregata via RPC.

#### 8. `Login` e `Logout` hardcoded
Nei componenti `MinimalHeader`, `ExplorePage`, `CollectionsPage`, `CollectionDetailPage`, `FreeSpotsPage` — i testi "Login" e "Logout" non passano per `t()`.

### Piano di pulizia

1. **Fix font Rubik Bubbles** in `tailwind.config.ts`
2. **Rimuovere `public/manifest.json`** e il `<link rel="manifest">` da `index.html`
3. **Aggiornare OG/canonical URLs** a `piposicily.lovable.app` in `index.html` + pulire righe vuote
4. **Tradurre testi hardcoded**: "Login", "Logout", "Nessun free spot ancora" → `t()`
5. **Fix AdminAnalytics**: creare una funzione DB `get_analytics_counts()` che fa `GROUP BY` server-side, e chiamarla via RPC invece di scaricare tutte le righe
6. Nessuna modifica strutturale al layout o alla logica business

