
# Piano: Separare il Testo Missione in Due Sezioni

## Situazione Attuale

Ho verificato l'app e:
- La homepage funziona correttamente: header con IT|EN e logo Pipo OK
- Il database ha GIA' `mission_part2` creato, ma:
  - `mission` contiene ancora TUTTO il testo (anche la parte dopo il CTA)
  - `HeroSection.tsx` usa una logica fragile che cerca la stringa "Cosa si intende per"
  - L'Admin panel ha un solo campo textarea

## Cosa Faremo

### 1. Aggiornare il Database
Pulire il campo `mission` per contenere SOLO la prima parte (fino a "Per chi è Pipo"), e assicurarsi che `mission_part2` contenga la seconda parte.

### 2. Admin Panel (src/pages/Admin.tsx)
- Aggiungere il fetch di `mission_part2`
- Aggiungere uno state `missionPart2Text`
- Dividere la card "Testo Missione" in due sezioni:
  - **Parte 1 - Prima del CTA**: il testo attuale "Chi è Pipo", "Cosa fa Pipo", "Per chi è Pipo"
  - **Parte 2 - Dopo il CTA**: "Cosa si intende per alieno", "Rispetto e generazione di valore"
- Due pulsanti "Salva" separati o un unico pulsante che salva entrambi

### 3. Homepage HeroSection (src/components/HeroSection.tsx)
- Aggiungere il fetch di `mission_part2` con `useSiteContent("mission_part2")`
- Aggiungere traduzione per entrambe le parti
- **RIMUOVERE** completamente la logica di string-split
- Mostrare: `mission` content → CTA Button → `mission_part2` content

## Risultato Finale

Potrai modificare liberamente entrambe le parti del testo dall'admin panel, senza che il CTA interferisca. Il pulsante apparirà sempre tra le due sezioni, indipendentemente dal contenuto testuale.

## File da Modificare

| File | Modifica |
|------|----------|
| `src/pages/Admin.tsx` | Aggiungere secondo textarea per "Parte 2" |
| `src/components/HeroSection.tsx` | Rimuovere string-split, usare due query separate |
| Database `site_content` | Pulire `mission` per contenere solo Parte 1 |
