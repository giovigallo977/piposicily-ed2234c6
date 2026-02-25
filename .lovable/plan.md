

# Diagnosi: Contrasto Badge e Banner

## Problema

Il badge "GRATUITO" e la scritta "Sblocca tutto" dovrebbero usare il colore `olive` scuro per garantire leggibilità, come già corretto in precedenza. Verificando il codice attuale:

- **Badge "GRATUITO"** (HotspotCard.tsx riga 90): usa `bg-olive text-olive-foreground` — corretto
- **"Sblocca tutto"** (ExplorePage.tsx riga 78): usa `text-olive` — corretto

Tuttavia, il valore CSS di `--olive` in `index.css` è `138 52% 55%` (luminosità 55%), mentre il design principle documenta `152 46% 43%` (luminosità 43%, più scuro). La luminosità al 55% rende il testo meno leggibile su sfondi chiari.

## Soluzione

Allineare la variabile `--olive` al valore documentato nei design principles, più scuro e contrastato:

**File: `src/index.css`**
- Cambiare `--olive: 138 52% 55%` → `--olive: 152 46% 43%`

Questo renderà immediatamente più scuri e leggibili tutti gli elementi che usano il colore olive: badge "GRATUITO", scritta "Sblocca tutto", badge "Membro Premium", e il bottone NAVIGA.

## Impatto

Un'unica modifica CSS che si propaga automaticamente a tutti i componenti. Nessun file di componenti da toccare.

