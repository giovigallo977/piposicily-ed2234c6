

# Piano: Grafiche decorative nella landing page (gestite da admin)

## Idea

Ispirandoti allo stile Notion/Tally (doodle e illustrazioni ai lati della pagina), aggiungiamo degli "slot" per grafiche decorative nella landing page. Tu carichi le immagini dall'admin, e appaiono nella homepage nelle posizioni giuste. Su mobile spariscono o si ridimensionano per non interferire col testo.

## Dove appaiono le grafiche

```text
Desktop:                              Mobile:
+----------------------------------+  +----------------+
|  [img]   Headline        [img]  |  |   Headline     |
|          Subtitle               |  |   Subtitle     |
|                                 |  |                |
|  [img]  +------+------+  [img] |  |  +----+----+   |
|         | Cat1 | Cat2 |        |  |  |Cat1|Cat2|   |
|         | Cat3 | Cat4 |        |  |  |Cat3|Cat4|   |
|         +------+------+        |  |  +----+----+   |
|                                 |  |                |
|  [====== Collezioni =========] |  |  [Collezioni]  |
|  [grafichette sul banner]      |  |                |
+----------------------------------+  +----------------+
```

- **Hero laterali (4 slot)**: 2 a sinistra, 2 a destra del contenuto hero. Visibili solo su desktop (md+), posizionati in modo assoluto. Dimensione ~80-120px, opacity leggera per non distrarre.
- **Banner Collezioni (2 slot)**: Piccole grafichette sovrapposte al banner Collezioni, una a sinistra e una a destra. Visibili su tutte le risoluzioni ma ridimensionate su mobile.

## Cosa si aggiunge nell'admin

Nella tab **Contenuti**, una nuova card **"Grafiche Decorative"** con 6 upload:

| Slot | Chiave DB | Posizione |
|------|-----------|-----------|
| Hero sinistra alto | `deco_hero_left_top` | A sinistra della headline |
| Hero sinistra basso | `deco_hero_left_bottom` | A sinistra delle categorie |
| Hero destra alto | `deco_hero_right_top` | A destra della headline |
| Hero destra basso | `deco_hero_right_bottom` | A destra delle categorie |
| Collezioni sinistra | `deco_collezioni_left` | Sovrapposta al banner Collezioni, lato sinistro |
| Collezioni destra | `deco_collezioni_right` | Sovrapposta al banner Collezioni, lato destro |

## Comportamento mobile-first

- Le 4 grafiche hero laterali: **nascoste su mobile** (`hidden md:block`), appaiono solo da tablet in su
- Le 2 grafiche Collezioni: visibili ma **ridimensionate** (40px su mobile, 60px su desktop)
- Nessuna grafica interferisce col testo o causa scroll orizzontale
- Le grafiche sono `position: absolute` con `pointer-events-none` per non bloccare i click

## Dettagli tecnici

| File | Modifica |
|------|----------|
| `src/pages/Admin.tsx` | Aggiungere card "Grafiche Decorative" con 6 ImageUpload + stato + useEffect + handler salvataggio. Nuovi `useSiteContent()` per le 6 chiavi. |
| `src/components/HeroSection.tsx` | Aggiungere 6 `useSiteContent()` per le grafiche. Renderizzare le immagini con posizionamento assoluto attorno al contenuto esistente e sul banner Collezioni. |

La struttura esistente della homepage (headline, subtitle, griglia categorie, collezioni, missione) resta identica. Le grafiche sono un layer decorativo sovrapposto.

