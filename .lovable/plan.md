
# Piano: Unificare il testo Missione in un unico campo

## Cosa cambia

### 1. Admin - Un solo campo testo missione
Il pannello admin attualmente mostra due textarea separate ("Parte 1" e "Parte 2") con un indicatore CTA in mezzo. Tutto questo viene sostituito da una singola textarea grande, pre-popolata con il testo completo della missione (da "Chi e Pipo" fino a "rifugi segreti").

Cambiamenti in `src/pages/Admin.tsx`:
- Rimuovere lo state `missionPart2Text` e il relativo `useSiteContent("mission_part2")`
- Unire le due textarea in una sola, piu grande (circa 20 righe)
- Rimuovere il divider CTA tra le due parti
- Il testo di default (quando il campo e vuoto) sara il contenuto completo del fallback gia presente nel codice
- `handleSaveMission` salvera tutto in una sola chiave DB (`mission`)

### 2. MissionSection - Leggere un solo campo
`src/components/MissionSection.tsx` usera solo `missionContent` (non piu `missionPart2Content`). Il testo viene mostrato come blocco unico con `whitespace-pre-line`.

### 3. HeroSection - Rimuovere il fetch di mission_part2
`src/components/HeroSection.tsx` non fara piu il fetch di `mission_part2`.

### 4. Pre-popolamento del testo
Quando il campo e vuoto nell'admin, mostrare come placeholder il testo completo della missione gia hardcoded nel fallback, cosi puoi vederlo e modificarlo. Il testo completo verra composto unendo tutte le sezioni del fallback (Chi e Pipo, Cosa fa Pipo, Per chi e Pipo, Cosa si intende per alieno, Rispetto e generazione di valore) in un formato leggibile con titoli e bullet point.

## Dettagli tecnici

| File | Azione |
|------|--------|
| `src/pages/Admin.tsx` | Rimuovere Part2, unire in un unico textarea, pre-popolare con fallback completo |
| `src/components/MissionSection.tsx` | Semplificare: un solo prop `missionContent`, render unico |
| `src/components/HeroSection.tsx` | Rimuovere fetch `mission_part2` |

## Risultato
Nell'admin vedrai un'unica textarea con tutto il testo della missione, gia visibile e modificabile liberamente come testo normale, senza separazioni o CTA in mezzo.
