# Hotspot Card Layout - Struttura Fissa

## Principio
La struttura delle card hotspot è DEFINITIVA e non deve essere modificata da future richieste di design.

## Layout Obbligatorio

### 1. Immagine Principale
- Aspect ratio 4:3
- Occupa tutta la larghezza della card
- Lazy loading attivo

### 2. Header (Titolo + Controlli)
- **Titolo**: a sinistra, font-heading, bold
- **Categoria badge**: a destra del titolo
- **Bottone espansione (+/-)**: estrema destra
- Layout: `flex items-start justify-between`

### 3. Descrizione Breve
- **SEMPRE su riga separata** sotto il titolo
- **SEMPRE larghezza completa** (non troncata)
- Va a capo automaticamente se troppo lunga
- Font: font-body, text-sm, text-muted-foreground

### 4. Bottone NAVIGA
- Colore: `bg-olive` (verde Pipo)
- Font: font-brand, font-black, italic
- Icona Navigation a sinistra del testo

### 5. Contenuto Espanso (Accordion)
- Descrizione completa
- Galleria foto (griglia 3 colonne)

## Colori Fissi
- Verde Pipo (olive): `90 60% 35%` HSL
- Card: bordi arrotondati 20px
- Sfondo card: bg-card

## Regole per Modifiche Future
1. NON spostare la descrizione breve dentro l'header
2. NON troncare la descrizione breve con line-clamp
3. NON cambiare il colore del bottone NAVIGA
4. Mantenere sempre la gerarchia visiva: Immagine → Titolo → Descrizione → Azione
