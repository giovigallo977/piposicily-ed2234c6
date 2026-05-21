## Obiettivo

Trasformare la homepage in un layout editoriale stile "Outliers": grande titolo "PIPO" in alto, navigazione orizzontale con categorie cliccabili, e griglia di schede hotspot che si aggiorna in base alla selezione.

## Nuovo layout homepage

```
─────────────────────────────────────────────────────────────
   PIPO                                              [IG]
─────────────────────────────────────────────────────────────

 ESPLORA IN LIBERTÀ · LUOGHI FANTASMA · NATURA · BORGHI ·
 ARTE E CULTURA · WORK STUDY EAT&DRINK · ABOUT PIPO · CONTATTI
─────────────────────────────────────────────────────────────

 [card hotspot] [card hotspot] [card hotspot] [card hotspot]
 [card hotspot] [card hotspot] [card hotspot] [card hotspot]
 ...
─────────────────────────────────────────────────────────────
```

- Titolo "PIPO" enorme, font serif elegante (tipo Outliers), allineato a sinistra.
- Icona Instagram in alto a destra.
- Riga di link orizzontali (uppercase, tracking ampio, font piccolo): tutte le voci una accanto all'altra, separate da spazi generosi. Su mobile diventano scrollabili orizzontalmente o si dispongono su 2 righe.
- Sotto la nav: griglia a 4 colonne desktop / 2 mobile di schede hotspot con immagine grande + titolo in basso (stile Outliers).
- Default al caricamento: mostra tutti gli hotspot ("esplora in libertà" attivo).
- Click su una categoria → filtra la griglia mostrando solo gli hotspot di quella categoria, senza cambiare pagina.
- Click su "Work Study Eat&Drink" → mostra i free spots invece degli hotspot.
- Click su "About Pipo" → apre un overlay/sezione modale con il testo fornito (👽 CHI È PIPO, 🌊 PER CHI È, 👽 PERCHÈ "ALIENO", 🌱 IL PRINCIPIO).
- Click su "Contatti" → apre overlay con IG: pipo.fuoriradar e pipoesplora@gmail.com.

## Comportamento

- Stato locale `activeFilter` con valori: `all` | `Luoghi Fantasma` | `Natura` | `Borghi` | `Arte e Cultura` | `free-spots`.
- La voce attiva ha un sottolineato o colore più scuro.
- Il click su "About" e "Contatti" apre due `Dialog` (shadcn) — non sostituiscono la griglia.
- Le card mantengono il comportamento esistente di `HotspotCard` (apertura dettaglio).
- Le sezioni eliminate dalla home attuale: hero fullscreen con headline/subtitle/CTA scroll, sezione "Decidi come esplorare" con i due pulsanti, MissionSection, sezione contatti in fondo. Tutto sostituito dal nuovo layout.

## File da modificare

- `src/components/HeroSection.tsx` → riscritto completamente come "MagazineHome" (oppure creato nuovo componente e sostituito in `Index.tsx`).
- `src/pages/Index.tsx` → usa il nuovo componente; rimuove `MinimalHeader` (il titolo "PIPO" sostituisce l'header).
- `src/contexts/LanguageContext.tsx` → aggiunge chiavi: `navExploreFreely`, `navAbout`, `navContacts`, `aboutChiTitle`, `aboutChiBody`, `aboutPerChiTitle`, `aboutPerChiBody`, `aboutAlienoTitle`, `aboutAlienoBody`, `aboutPrincipioTitle`, `aboutPrincipioBody` (traduzioni IT + EN).
- Nessuna modifica al backend / DB — uso `useHotspots()` e `useFreeSpots()` già esistenti.

## Note tecniche

- Tipografia "PIPO": uso `font-serif` di Tailwind o aggiungo un font serif (es. Cormorant / Playfair) via Google Fonts in `index.html` e mappato in `tailwind.config.ts`. Da confermare quale font.
- Manteniamo le immagini delle card hotspot dal campo `foto_principale` esistente.
- Tema chiaro mantenuto (background avorio/off-white, testo nero), coerente con la memory `light theme only`.

## Domande prima di partire

1. Font del titolo "PIPO": preferisci un serif sottile in stile Outliers (es. Cormorant Garamond) o qualcosa di più caratteristico?
2. "About Pipo" e "Contatti" — apertura in modale o in sezione che si espande sotto la nav (sostituendo temporaneamente la griglia)?
3. Vuoi anche eliminare definitivamente la MissionSection esistente o spostare quel contenuto dentro "About Pipo"?
