

# Piano: Nuovo Layout Homepage

## Cosa cambia

La homepage attuale ha: Logo+Header > Headline > Subtitle > CTA button (fuchsia) > Carousel foto > Mission text > CTA secondaria > Mission part 2.

Il nuovo layout da mockup: Logo "Pipo" centrato > Headline (hero) > Subtitle (sotto-hero) > CTA testo "Esplora gli itinerari di Pipo" > Griglia 2x2 con 4 categorie (foto quadrate, bordi arrotondati, titolo bianco sovrapposto) > Mission content ("chi e pipo" etc.)

Le 4 categorie sono:
- **Luoghi Fantasma**
- **Natura**
- **Borghi**
- **Arte e Cultura**

Ogni foto porta alla pagina `/esplora` filtrata per quella categoria.

---

## Modifiche tecniche

### 1. `src/components/HeroSection.tsx`

Ristrutturare il componente mantenendo tutti gli hook e la logica di traduzione esistente:

- **Rimuovere**: il carousel orizzontale delle foto hotspot
- **Rimuovere**: il bottone CTA fuchsia arrotondato
- **Aggiungere**: testo CTA "Esplora gli itinerari di Pipo" (in bold/italic, centrato, come nel mockup)
- **Aggiungere**: griglia 2x2 con 4 card categoria
  - Ogni card: immagine quadrata (aspect-ratio 1:1), bordi arrotondati (~16-20px), titolo bianco in basso a sinistra sovrapposto all'immagine
  - Le 4 categorie hardcoded: "Luoghi Fantasma", "Natura", "Borghi", "Arte e Cultura"
  - Click su ogni card naviga a `/esplora?categoria=NomeCategoria`
  - Le immagini verranno prese dai primi hotspot di ciascuna categoria (dal DB) oppure placeholder
- **Mantenere**: la sezione Mission (chi e pipo, etc.) sotto la griglia
- **Mantenere**: tutta la logica di traduzione esistente

### 2. `src/pages/ExplorePage.tsx`

Aggiungere supporto per il parametro URL `categoria`:

- Leggere `searchParams.get("categoria")`
- Filtrare gli hotspot per `h.categoria === categoriaParam`
- Aggiornare la logica `getBackDestination()` per gestire il ritorno dalla categoria

### 3. `src/contexts/LanguageContext.tsx`

Aggiungere le traduzioni per le 4 categorie e il nuovo testo CTA:

```
exploreCta: "Esplora gli itinerari di Pipo" / "Explore Pipo's itineraries"
catLuoghiFantasma: "Luoghi Fantasma" / "Ghost Places"
catNatura: "Natura" / "Nature"
catBorghi: "Borghi" / "Villages"
catArteECultura: "Arte e Cultura" / "Art & Culture"
```

---

## File coinvolti

| File | Modifica |
|------|----------|
| `src/components/HeroSection.tsx` | Rimuovere carousel, aggiungere griglia 2x2 categorie |
| `src/pages/ExplorePage.tsx` | Supporto filtro per parametro `categoria` nell'URL |
| `src/contexts/LanguageContext.tsx` | Nuove chiavi di traduzione per categorie e CTA |

## Cosa NON cambia

- MinimalHeader (logo "Pipo" + selettore lingua) resta invariato
- Tutta la logica di traduzione e gli hook `useTranslatedContent`
- La sezione Mission sotto la griglia
- Il routing generale dell'app
- Il design system (colori, font, variabili CSS)

