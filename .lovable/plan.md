

## Piano: Centratura Homepage su Desktop

### Problema attuale

Il container (`max-w-4xl mx-auto`) è centrato, ma gli elementi al suo interno hanno `text-left`, quindi su schermi larghi il testo appare spostato a sinistra.

**Layout attuale su desktop:**
```
|                                              |
|    Esplorazioni aliene...                    |
|    Ti mostro posti...                        |
|    [Portami via da qui]                      |
|                                              |
```

**Layout desiderato su desktop:**
```
|                                              |
|         Esplorazioni aliene...               |
|         Ti mostro posti...                   |
|         [Portami via da qui]                 |
|                                              |
```

---

### Soluzione

Centrare gli elementi su desktop mantenendo l'allineamento a sinistra su mobile.

---

### Modifiche al file `src/components/HeroSection.tsx`

**1. Container principale**
- Aggiungere `md:text-center md:items-center` per centrare su desktop

**2. Headline (h1)**
- Cambiare da `text-left` a `text-left md:text-center`

**3. Subtitle (p)**
- Cambiare da `text-left` a `text-left md:text-center`
- Cambiare `max-w-md` a `max-w-md md:mx-auto` per centrare il blocco

**4. CTA container**
- Aggiungere `md:mx-auto` per centrare il pulsante su desktop

---

### Codice modificato

```tsx
<section className="px-6 py-12 flex flex-col min-h-[75vh] justify-center" ...>
  <div className="max-w-4xl mx-auto w-full md:flex md:flex-col md:items-center">
    
    {/* Headline - Left on mobile, centered on desktop */}
    <h1 className="... text-left md:text-center">
      {headline}
    </h1>

    {/* Subtitle - Left on mobile, centered on desktop */}
    <p className="... text-left md:text-center max-w-md md:mx-auto">
      {subtitle}
    </p>

    {/* CTA Button - Centered on desktop */}
    <div className="w-full max-w-sm mt-8 md:mx-auto">
      ...
    </div>
    
  </div>
</section>
```

---

### Risultato finale

**Mobile (< 768px):** Layout invariato, allineato a sinistra

**Desktop (≥ 768px):** Tutto centrato
```
          Esplorazioni aliene in Sicilia
     Ti mostro posti iper selezionati...
          [    Portami via da qui    ]
           Zona → Mood → Esplora...
              [carousel photos]
```

---

### Riepilogo

| File | Modifiche |
|------|-----------|
| `src/components/HeroSection.tsx` | Aggiungere classi responsive `md:text-center`, `md:items-center`, `md:mx-auto` |

