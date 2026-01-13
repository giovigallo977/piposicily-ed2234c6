# Principi di Design - Struttura Immutabile

## Filosofia
Ogni decisione strutturale documentata qui è DEFINITIVA. Le modifiche future devono rispettare questi principi senza eccezioni.

## Identità Visiva

### Colori Brand
- **Verde Pipo (olive)**: HSL `90 60% 35%` - Usato per azioni primarie (NAVIGA)
- **Foreground**: Toni caldi neutri (30 10% 15%)
- **Background**: Bianco puro

### Tipografia
- **Titoli**: Proxima Nova Bold (font-heading)
- **Body**: Proxima Nova Regular (font-body)
- **Brand/CTA**: Inter Black Italic (font-brand)

### Spaziatura
- Padding card: 20px (p-5)
- Border radius card: 20px (rounded-[20px])
- Gap tra elementi: coerente e generoso

## Principi UX Immutabili

### 1. Leggibilità Prima di Tutto
- Testi descrittivi MAI troncati se importanti per l'utente
- Line-clamp solo per preview, mai per contenuti informativi

### 2. Gerarchia Chiara
- Immagine → Titolo → Descrizione → Azione
- Ogni livello deve essere distinguibile

### 3. Azioni Evidenti
- Bottoni sempre con colore distintivo
- Icone accompagnano sempre il testo dell'azione

## Comportamento PWA - Immutabile

### Auto-Update Obbligatorio
- La PWA DEVE aggiornarsi automaticamente senza intervento utente
- `skipWaiting: true` e `clientsClaim: true` sono OBBLIGATORI
- Check aggiornamenti ogni 60 secondi
- Check aggiornamenti quando l'utente torna all'app (visibility change)
- Reload automatico quando nuovo service worker prende controllo

### Caching Strategy
- API Supabase: NetworkFirst (5 min cache)
- Immagini: CacheFirst (7 giorni cache)
- Assets statici: precached automaticamente

## Regole per AI Future
1. Prima di modificare layout, verificare questo file
2. Le strutture qui documentate sono LOCKED
3. Nuove feature devono integrarsi senza rompere l'esistente
4. In caso di dubbio, chiedere conferma all'utente
5. MAI rimuovere o modificare la configurazione auto-update PWA
6. MAI disabilitare skipWaiting o clientsClaim
