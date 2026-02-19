
# Rimozione del sistema di blocco contenuti

## Cosa viene rimosso

Il sistema di oscuramento (glassmorphism + lock) è presente in 2 file e viene eliminato completamente.

---

## Modifiche

### 1. `src/components/HotspotCard.tsx`
- Rimozione della prop `locked` dall'interfaccia `HotspotCardProps`
- Rimozione del parametro `locked = false` dalla firma del componente
- Rimozione della logica condizionale `!locked && "hover:shadow-xl..."` — l'hover viene reso sempre attivo
- Rimozione dell'import di `Lock` da lucide-react (non più usato)
- Eliminazione del blocco JSX "Glass lock overlay" (~7 righe)

### 2. `src/pages/ExplorePage.tsx`
- Rimozione della prop `locked={index >= 3}` dalla chiamata a `<HotspotCard />`
- La prop `index` rimane (usata internamente per altri scopi se necessario, altrimenti rimossa anch'essa se non servisse)

---

## Risultato
Tutti gli hotspot diventano accessibili e visibili senza limitazioni. Nessuna logica di paywall o blur rimane nel codice.
