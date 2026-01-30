

## Piano: Ottimizzazione Desktop + Centratura Wizard

### Panoramica

Ottimizzare l'applicazione per schermi desktop con contenuti ben centrati e layout responsive. Centrare le opzioni del menu wizard (Zona, Mood, Esplora in libertà).

---

### 1. Pagina Wizard (`src/pages/WizardPage.tsx`)

**Problema attuale:** I pulsanti del menu sono allineati a sinistra con `justify-between`.

**Soluzione:** Centrare le opzioni del menu principale.

**Modifiche:**
- Cambiare i pulsanti da `justify-between` a `justify-center` con testo centrato
- Rimuovere le frecce Arrow a destra (ora ridondanti con layout centrato)
- Aggiungere `max-w-md mx-auto` per contenere il layout su desktop
- Aggiungere `md:max-w-lg` per una larghezza leggermente maggiore su desktop

**Layout attuale:**
```
[Zona                    →]
[Mood                    →]
[Esplora in libertà      →]
```

**Nuovo layout (centrato):**
```
        Zona →
        Mood →
  Esplora in libertà →
```

---

### 2. Homepage Hero (`src/components/HeroSection.tsx`)

**Problema attuale:** Il contenuto è allineato a sinistra senza limiti su desktop.

**Modifiche:**
- Aggiungere container con `max-w-4xl mx-auto` per centrare su desktop
- Mantenere `text-left` per il testo ma contenuto nel container
- Ridurre la dimensione del titolo su mobile con responsive: `text-[32px] md:text-[48px]`

---

### 3. Header (`src/components/MinimalHeader.tsx`)

**Problema attuale:** Già centrato con container, ma può essere migliorato.

**Modifiche:**
- Aggiungere `max-w-4xl mx-auto` per allineare con il contenuto hero

---

### 4. Explore Page (`src/pages/ExplorePage.tsx`)

**Problema attuale:** Cards limitate a `max-w-lg` - troppo stretto su desktop.

**Modifiche:**
- Cambiare a griglia responsive: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- Rimuovere `max-w-lg` e usare `max-w-6xl` per il container
- Aggiungere `max-w-md mx-auto` per header su desktop

---

### 5. Mission Page (`src/pages/Mission.tsx`)

**Modifiche:**
- Verificare che usi container centrato (già `max-w-md mx-auto`)
- OK, già ottimizzato

---

### Riepilogo tecnico modifiche

| File | Modifiche |
|------|-----------|
| `src/pages/WizardPage.tsx` | Centrare menu options, aggiungere container max-width |
| `src/components/HeroSection.tsx` | Aggiungere max-w container, responsive font sizes |
| `src/components/MinimalHeader.tsx` | Allineare max-width con hero |
| `src/pages/ExplorePage.tsx` | Griglia responsive per cards, container più largo |

---

### Dettagli implementativi

#### WizardPage - Menu centrato

```tsx
{/* Menu options - CENTERED */}
<div className="w-full max-w-sm space-y-4">
  <button 
    onClick={() => handleStepChange("zona")} 
    className="flex items-center justify-center gap-3 w-full py-2 group"
  >
    <span className="font-sans text-xl font-bold text-foreground">
      {t("wizardZona")}
    </span>
    <ArrowRight className="w-5 h-5 text-olive" strokeWidth={3} />
  </button>
  {/* ... altri pulsanti uguali */}
</div>
```

#### HeroSection - Container centrato

```tsx
<section className="px-6 py-12 flex flex-col min-h-[75vh] justify-center">
  <div className="max-w-4xl mx-auto w-full">
    {/* Contenuto esistente */}
  </div>
</section>
```

#### ExplorePage - Griglia responsive

```tsx
<main className="container mx-auto px-4 py-6 pb-24">
  <div className="max-w-6xl mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredHotspots.map(...)}
    </div>
  </div>
</main>
```

---

### Note

- Tutte le modifiche sono retrocompatibili con mobile
- Si usano breakpoint Tailwind standard (`md:` = 768px, `lg:` = 1024px)
- Il design mobile-first viene mantenuto

