

## Piano: Uniformare dimensione titolo Wizard

### Problema attuale

Il titolo "Portami via da qui" nella pagina Wizard ha un font molto più piccolo rispetto al titolo della homepage.

| Elemento | Font attuale | Font desiderato |
|----------|--------------|-----------------|
| Homepage "Esplorazioni aliene..." | 32px (mobile) / 48px (desktop) | invariato |
| Wizard "Portami via da qui" | 20px (text-xl) | 32px (mobile) / 48px (desktop) |

---

### Soluzione

Aggiornare il titolo in `WizardPage.tsx` per usare le stesse classi responsive del titolo Hero.

---

### Modifica file `src/pages/WizardPage.tsx`

**Riga 101 - Da:**
```tsx
<h1 className="font-bubbles text-foreground text-center mb-8 text-xl font-semibold">
```

**A:**
```tsx
<h1 className="font-bubbles text-[32px] md:text-[48px] font-bold leading-[1.1] text-foreground text-center mb-8">
```

---

### Dettagli tecnici

- `text-[32px]` → 32px su mobile (come Hero)
- `md:text-[48px]` → 48px su desktop (come Hero)
- `font-bold` → peso uniforme con Hero
- `leading-[1.1]` → interlinea compatta per titoli
- Mantiene `font-bubbles` per il carattere distintivo della pagina Wizard

---

### Risultato finale

Il titolo "Portami via da qui" avrà la stessa dimensione visiva di "Esplorazioni aliene in Sicilia", creando coerenza tipografica tra le pagine.

