
# Piano: Separare il Testo Missione in Due Sezioni

## Problema Attuale
Il CTA "Portami via da qui" viene inserito nel mezzo del testo missione cercando la frase "Cosa si intende per". Se modifichi il testo e quella frase non c'è più o è scritta diversamente, il pulsante non appare nel posto giusto (o il testo viene tagliato).

## Soluzione
Dividere il contenuto della missione in **due campi separati** nel backend:
- **Parte 1**: "Chi è Pipo", "Cosa fa Pipo", "Per chi è Pipo" (tutto ciò che viene PRIMA del CTA)
- **Parte 2**: "Cosa si intende per alieno", "Rispetto e generazione di valore" (tutto ciò che viene DOPO il CTA)

Il CTA verrà inserito automaticamente tra le due parti, senza dipendere dal contenuto testuale.

---

## Modifiche Tecniche

### 1. Database
Creare un nuovo record in `site_content` con key `mission_part2` e spostare la seconda parte del testo attuale.

### 2. Admin Panel (src/pages/Admin.tsx)
- Aggiungere un secondo campo textarea per "Parte 2 - Dopo il CTA"
- Rinominare il campo esistente in "Parte 1 - Prima del CTA"
- Aggiungere logica per salvare entrambi i campi

### 3. Homepage (src/components/HeroSection.tsx)
- Caricare entrambi i contenuti (`mission` e `mission_part2`)
- Rimuovere la logica di split basata sulla stringa
- Mostrare: Parte 1 → CTA → Parte 2

---

## Risultato Finale
Potrai modificare liberamente entrambe le parti del testo senza che il CTA interferisca. Il pulsante apparirà sempre tra le due sezioni, indipendentemente dal contenuto.
