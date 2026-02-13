

# Piano: Hotspot bloccati dal 4o in poi con effetto glass/blur

## Cosa cambia

Nella pagina Esplora, i primi 3 hotspot di ogni lista filtrata saranno visibili normalmente. Dal 4o hotspot in poi, le card saranno "oscurate" con un effetto vetro opaco (glassmorphism + blur) che lascia intuire la presenza del contenuto ma impedisce di leggerlo. Sopra l'effetto blur apparira un overlay con un'icona lucchetto e un invito all'acquisto.

## Dettagli tecnici

### `src/components/HotspotCard.tsx`

Aggiungere una nuova prop `locked?: boolean`.

Quando `locked` e `true`:
- L'intera card viene avvolta in un contenitore `relative`
- Sopra la card viene sovrapposto un div con:
  - `backdrop-blur-md` per sfuocare il contenuto sottostante
  - `bg-white/60` per l'effetto vetro opaco
  - `rounded-3xl` per seguire i bordi della card
  - `absolute inset-0 z-10` per coprire tutto
- Al centro dell'overlay: icona Lock (da lucide-react), testo "Sblocca questa categoria" e un bottone CTA
- L'espansione (+/-), il click sulla galleria e tutti i link sono disabilitati quando `locked`
- Il bottone CTA puo linkare a una pagina acquisto futura o mostrare un messaggio placeholder

### `src/pages/ExplorePage.tsx`

Nella griglia dove si mappano i `filteredHotspots`, passare la prop `locked={index >= 3}` a ogni `HotspotCard`:

```
filteredHotspots.map((hotspot, index) => (
  <HotspotCard key={hotspot.id} hotspot={hotspot} index={index} locked={index >= 3} />
))
```

## File coinvolti

| File | Modifica |
|------|----------|
| `src/components/HotspotCard.tsx` | Aggiungere prop `locked`, overlay glass blur con CTA, disabilitare interazioni |
| `src/pages/ExplorePage.tsx` | Passare `locked={index >= 3}` alle card |

## Comportamento visivo

- Card 1, 2, 3: normali, completamente visibili e interattive
- Card 4, 5, 6...: visibili ma sfuocate/opache, con overlay "Sblocca" sopra, non cliccabili

