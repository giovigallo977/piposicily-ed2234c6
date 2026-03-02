

## Piano: Hero fullscreen con scroll verso categorie

### Cosa cambia

Separare la sezione hero in due parti:
1. **Schermo 1** (fullscreen): Header + Headline + Subtitle + CTA text, centrati verticalmente, occupano `min-h-[100dvh]` (usando `dvh` per PWA/mobile che tiene conto della barra browser)
2. **Schermo 2** (sotto scroll): Griglia categorie + Mission

### File da modificare

**`src/components/HeroSection.tsx`**

- Wrappare headline + subtitle + CTA in un container con `min-h-[100dvh]` e `flex items-center justify-center` (sottraendo l'altezza dell'header ~72px con `pt-0` dato che l'header e' fuori)
- Spostare la griglia categorie e MissionSection fuori da questo container fullscreen, in modo che appaiano solo scrollando
- Aggiungere un indicatore visivo di scroll (freccia animata verso il basso) in fondo alla sezione hero fullscreen

**`src/pages/Index.tsx`**

- Rimuovere il passaggio di `min-h-[75vh]` dalla section, dato che ora il layout e' gestito internamente con due blocchi separati

### Struttura risultante

```text
┌─────────────────────────┐
│  Header (Pipo logo)     │  ← gia' fuori da HeroSection
├─────────────────────────┤
│                         │
│  "La Sicilia fuori      │
│   dal turismo di massa" │  ← fullscreen (100dvh - header)
│                         │
│  Subtitle               │
│  CTA italic             │
│                         │
│        ↓ (scroll hint)  │
├─────────────────────────┤
│  ┌──────┐ ┌──────┐     │
│  │ Cat1 │ │ Cat2 │     │  ← appare scrollando
│  └──────┘ └──────┘     │
│  ┌──────┐ ┌──────┐     │
│  │ Cat3 │ │ Cat4 │     │
│  └──────┘ └──────┘     │
│  ┌──────┐ ┌──────┐     │
│  │Colle.│ │Free  │     │
│  └──────┘ └──────┘     │
│                         │
│  Mission section        │
└─────────────────────────┘
```

### Dettaglio tecnico

1. La section esterna perde `min-h-[75vh]` e `justify-center`
2. Nuovo div interno per l'hero text: `min-h-[calc(100dvh-72px)] flex flex-col items-center justify-center`
3. Le decorative graphics restano posizionate nella zona fullscreen
4. Freccia scroll: un `ChevronDown` animato con `animate-bounce`, posizionato in basso al centro della zona fullscreen
5. La griglia categorie mantiene stile identico, solo spostata sotto il blocco fullscreen

