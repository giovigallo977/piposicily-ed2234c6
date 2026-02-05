
# Piano: Ottimizzazione Funnel Landing Page Pipo

## Obiettivo
La CTA principale diventa l'esplorazione degli hotspot. La CTA Instagram viene spostata alla fine del percorso, visibile solo dopo che l'utente ha esplorato.

---

## 1. Hero Section - Semplificazione CTA

### Stato attuale (righe 82-102 di HeroSection.tsx)
| Posizione | Testo | Stile | Azione |
|-----------|-------|-------|--------|
| 1a (primaria) | "Sblocca 1 mappa aliena" | Fuchsia pieno | Instagram |
| 2a (secondaria) | "Esplora gli hotspot di Pipo" | Outline nero | Wizard |

### Nuovo stato
| Posizione | Testo | Stile | Azione |
|-----------|-------|-------|--------|
| Unica CTA | "esplora gli hotspot di pipo" | Fuchsia pieno | Wizard |

Con microtesto sotto: "Scopri gli hotspot alieni in base al tuo mood e alla zona che vuoi esplorare."

### Modifiche tecniche

**File: `src/components/HeroSection.tsx`**

- **Rimuovere** il blocco PRIMARY CTA Instagram (righe 84-92):
```jsx
{/* PRIMARY CTA - Instagram (più prominente) */}
<div>
  <button onClick={handleInstagramClick} ...>
    {t("heroPrimaryCtaBtn")}
  </button>
  <p>...</p>
</div>
```

- **Trasformare** la CTA secondaria in primaria (righe 94-102):
  - Cambiare stile da outline a fuchsia pieno (`bg-fuchsia-700`)
  - Mantenere `onClick={onCtaClick}` (che porta al wizard)
  - Usare `heroSecondaryCtaBtn` (testo esistente ma da aggiornare a minuscolo)
  - Usare `heroSecondaryCtaSublabel` per il microtesto

- **Rimuovere** anche `handleInstagramClick` e l'import del link Instagram (non piu necessari nella hero)

---

## 2. Wizard Page - Sostituzione CTA Instagram

### Stato attuale (righe 129-137 di WizardPage.tsx)
- Bottone fuchsia: "Sblocca 1 mappa aliena"
- Microtesto: "Scrivimi ALIENO in DM..."

### Nuovo stato
- Titolo: "Vuoi una mappa ancora piu aliena?"
- Testo: "Se dopo aver esplorato gli hotspot di Pipo vuoi un itinerario pensato solo per te, puoi sbloccare 1 mappa aliena segreta, scrivimi ALIENO in DM su Instagram"
- Bottone: "Scrivimi su Instagram" (link al profilo esistente)

### Modifiche tecniche

**File: `src/pages/WizardPage.tsx`**

Sostituire il blocco CTA Instagram (righe 129-137) con:
```jsx
{/* New Instagram CTA Section */}
<div className="mt-8 text-center max-w-xs">
  <h2 className="font-sans text-lg font-bold text-foreground mb-3">
    {t("alienMapCtaTitle")}
  </h2>
  <p className="font-sans text-sm text-secondary-foreground mb-4">
    {t("alienMapCtaDesc")}
  </p>
  <a href={instagramLink} target="_blank" rel="noopener noreferrer" 
     className="inline-flex items-center justify-center px-6 py-3 font-sans font-bold text-base rounded-full transition-transform duration-200 hover:scale-105 bg-fuchsia-700 text-primary-foreground">
    {t("instagramCtaBtn")}
  </a>
</div>
```

---

## 3. Explore Page - Nuova sezione finale + aggiornamento footer

### Stato attuale (righe 132-139 di ExplorePage.tsx)
- Footer fisso con bottone "Sblocca 1 mappa aliena"

### Nuovo stato
- Sezione finale dopo la griglia hotspot con titolo, testo e CTA
- Footer con testo bottone aggiornato: "Scrivimi su Instagram"

### Modifiche tecniche

**File: `src/pages/ExplorePage.tsx`**

1. **Aggiungere sezione finale** dopo la griglia hotspot (prima del footer, riga ~129):
```jsx
{/* Final Instagram CTA Section */}
{!isLoading && filteredHotspots.length > 0 && (
  <div className="mt-16 mb-8 text-center max-w-md mx-auto px-4">
    <h2 className="font-sans text-xl font-bold text-foreground mb-4">
      {t("alienMapCtaTitle")}
    </h2>
    <p className="font-sans text-base text-secondary-foreground mb-6">
      {t("alienMapCtaDesc")}
    </p>
  </div>
)}
```

2. **Aggiornare testo bottone footer** (riga 136):
```jsx
{t("instagramCtaBtn")}  // invece di {t("wizardInstagramBtn")}
```

---

## 4. Traduzioni - Nuove chiavi

**File: `src/contexts/LanguageContext.tsx`**

### Aggiungere nuove chiavi:

| Chiave | IT | EN |
|--------|----|----|
| `alienMapCtaTitle` | Vuoi una mappa ancora piu aliena? | Want an even more alien map? |
| `alienMapCtaDesc` | Se dopo aver esplorato gli hotspot di Pipo vuoi un itinerario pensato solo per te, puoi sbloccare 1 mappa aliena segreta, scrivimi ALIENO in DM su Instagram | If after exploring Pipo's hotspots you want an itinerary designed just for you, you can unlock 1 secret alien map, DM me ALIENO on Instagram |
| `instagramCtaBtn` | Scrivimi su Instagram | DM me on Instagram |

### Aggiornare chiave esistente:

| Chiave | Vecchio valore | Nuovo valore IT | Nuovo valore EN |
|--------|----------------|-----------------|-----------------|
| `heroSecondaryCtaBtn` | Esplora gli hotspot di Pipo | esplora gli hotspot di pipo | explore pipo's hotspots |

---

## 5. Riepilogo file da modificare

| File | Modifiche |
|------|-----------|
| `src/contexts/LanguageContext.tsx` | Aggiungere 3 nuove chiavi, aggiornare `heroSecondaryCtaBtn` |
| `src/components/HeroSection.tsx` | Rimuovere CTA Instagram, promuovere CTA esplorazione a primaria |
| `src/pages/WizardPage.tsx` | Sostituire CTA "Sblocca 1 mappa aliena" con nuova sezione |
| `src/pages/ExplorePage.tsx` | Aggiungere sezione finale CTA, aggiornare testo bottone footer |

---

## 6. Flusso utente finale

```text
LANDING (/)
    |
    +-- CTA unica: "esplora gli hotspot di pipo" (fuchsia)
              |
              v
         WIZARD (/wizard)
              |
              +-- Zona --> /esplora?zona=X
              +-- Mood --> /esplora?mood=X
              +-- Esplora in Liberta --> /esplora
              |
              +-- (in fondo) Sezione "Vuoi una mappa ancora piu aliena?"
                  + bottone "Scrivimi su Instagram"
              
         ESPLORA (/esplora)
              |
              +-- Griglia hotspot
              |
              +-- Sezione finale: "Vuoi una mappa ancora piu aliena?"
              |
              +-- Footer fisso: "Scrivimi su Instagram"
```

---

## 7. Cosa rimane invariato

- Headline e sottotitolo della Hero (contenuti da database o fallback)
- Stile grafico (colori, font, layout)
- Tono di voce alieno
- Carousel di foto
- Sezione Mission sotto il carousel
- CTA secondaria sotto la mission (outline, stesso testo)
- Contenuto degli hotspot e delle card
- Funzionalita del wizard (Zona, Mood, Esplora)
