

# Spostare badge "Zona" accanto alla categoria

## Problema
Il badge zona è attualmente dentro il contenuto espanso (accordion), visibile solo dopo aver cliccato "+". L'utente vuole vederlo subito, accanto al badge categoria.

## Modifica

### `src/components/HotspotCard.tsx`

1. **Rimuovere** il blocco zona dal contenuto espanso (dentro `overflow-hidden`, circa riga 153-158)

2. **Aggiungere** il badge zona nella sezione categoria (riga ~125), trasformandola in una riga con entrambi i badge affiancati:

```tsx
{/* Categoria + Zona */}
{(translated.categoria || hotspot.zona) && (
  <div className="mt-4 mb-4 flex flex-wrap items-center gap-2">
    {translated.categoria && (
      <span className="px-3 py-1.5 text-xs font-bold rounded-full bg-foreground text-background">
        {translated.categoria}
      </span>
    )}
    {hotspot.zona && (
      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-foreground text-background">
        📍 zona {hotspot.zona}
      </span>
    )}
  </div>
)}
```

Un solo file modificato, nessuna modifica al database.

