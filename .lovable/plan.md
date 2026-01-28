
## Piano: Pulsante Instagram nel Wizard + Gestione Backend

### Panoramica

Modificare la sezione "Portami via da qui" nel wizard per:
1. Rimuovere la cornice "cartello" (sfondo bianco, bordo nero, palo)
2. Rimuovere la frase "Ancora qui?"
3. Aggiungere un pulsante "Scrivimi su Instagram" sotto "Esplora in libertà"
4. Aggiungere il testo descrittivo sotto il pulsante
5. Rendere il link del pulsante configurabile dal backend

---

### Modifiche da implementare

#### 1. Database: Nuova chiave per il link Instagram

Aggiungere una nuova riga nella tabella `site_content`:
- **key**: `wizard_instagram_link`
- **content**: (vuoto inizialmente, da compilare nel backend)

```sql
INSERT INTO site_content (key, content) VALUES ('wizard_instagram_link', '');
```

---

#### 2. Admin Panel: Campo per gestire il link

**File: `src/pages/Admin.tsx`**

Aggiungere nella sezione "Contenuti" una nuova Card per gestire il link Instagram del wizard:

```text
Wizard Instagram
- Campo input per il link Instagram
- Pulsante "Salva"
```

Modifiche tecniche:
- Aggiungere hook `useSiteContent("wizard_instagram_link")`
- Aggiungere stato `wizardInstagramLink`
- Aggiungere funzione `handleSaveWizardInstagram()`
- Aggiungere UI nella TabsContent "contenuti"

---

#### 3. Traduzioni: Nuove chiavi

**File: `src/contexts/LanguageContext.tsx`**

Aggiungere le seguenti traduzioni:

| Chiave | Italiano | English |
|--------|----------|---------|
| `wizardInstagramBtn` | Scrivimi su Instagram | Write me on Instagram |
| `wizardInstagramDesc` | Hai bisogno di itinerari super specifici per la tua esplorazione in Sicilia? Scrivimi in DM su Instagram con la parola ALIENO e ti aiuto a costruire il tuo itinerario fuori dai radar. | Need super specific itineraries for your exploration in Sicily? Write me a DM on Instagram with the word ALIENO and I'll help you build your off-the-radar itinerary. |

---

#### 4. WizardPage: Nuovo layout senza cornice

**File: `src/pages/WizardPage.tsx`**

Struttura attuale (da rimuovere):
```
┌─────────────────────┐
│  [peg nero in alto] │
│ ┌─────────────────┐ │
│ │   Zona    →     │ │
│ │   Mood    →     │ │
│ │ Esplora   →     │ │
│ └─────────────────┘ │
│     [palo nero]     │
└─────────────────────┘
      "Ancora qui?"
```

Nuova struttura:
```
   Zona          →
   Mood          →
   Esplora       →

[Scrivimi su Instagram]

(testo descrittivo CTA)
```

Modifiche tecniche nel componente step "main":
- Rimuovere il container `bg-white border-[3px] border-black rounded-lg`
- Rimuovere il "peg" superiore (`absolute -top-3`)
- Rimuovere il "palo" inferiore (`w-4 h-32 bg-black`)
- Rimuovere il paragrafo con `t("wizardYourTurn")`
- Mantenere i 3 bottoni (Zona, Mood, Esplora) con il loro stile
- Aggiungere il pulsante Instagram con link dal backend
- Aggiungere il testo descrittivo sotto

---

### Dettagli tecnici

#### Hook per il link Instagram

Nel WizardPage, importare e usare:
```typescript
import { useSiteContent } from "@/hooks/useSiteContent";

// Nel componente
const { data: instagramLinkContent } = useSiteContent("wizard_instagram_link");
const instagramLink = instagramLinkContent?.content || "#";
```

#### Stile del pulsante Instagram

Coerente con il design esistente:
- Background: `bg-olive` (verde Pipo)
- Testo: bianco, bold
- Bordo arrotondato: `rounded-full` (stile pill)
- Hover: scala leggera
- Apertura in nuova tab con `target="_blank"`

#### Stile del testo descrittivo

- Font: `font-sans`
- Dimensione: `text-sm` o `text-base`
- Colore: `text-muted-foreground`
- Allineamento: centrato
- Padding: adeguato sopra/sotto

---

### Riepilogo file da modificare

| File | Azione |
|------|--------|
| `src/pages/WizardPage.tsx` | Rimuovere cornice, aggiungere pulsante e testo |
| `src/pages/Admin.tsx` | Aggiungere campo per link Instagram |
| `src/contexts/LanguageContext.tsx` | Aggiungere traduzioni |
| Database (migration) | Inserire chiave `wizard_instagram_link` |

---

### Flusso utente finale

1. Admin inserisce il link Instagram nel backend (sezione Contenuti > Wizard Instagram)
2. L'utente visita il wizard e vede:
   - Titolo "Portami via da qui"
   - Opzioni Zona, Mood, Esplora (senza cornice)
   - Pulsante "Scrivimi su Instagram"
   - Testo descrittivo della CTA
3. Cliccando il pulsante, si apre Instagram in una nuova tab

