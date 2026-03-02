

## Piano: Bottone CTA + layout hero migliorato

### Modifiche in `src/components/HeroSection.tsx`

**1. Aggiungere stato per PremiumModal**
- Importare `useState` e `PremiumModal`
- Aggiungere `const [premiumOpen, setPremiumOpen] = useState(false)`

**2. Riorganizzare spaziatura verticale del contenuto hero (linee 131-146)**

Layout desiderato dall'alto verso il basso, dentro il container centrato:
- Headline ("La Sicilia fuori dal turismo di massa") — spostato leggermente piu' in alto con margin-top negativo o padding-top ridotto
- Subtitle ("Luoghi nascosti...") — `mt-8` invece di `mt-6`, per piu' respiro
- CTA text ("Una guida per perdersi...") — `mt-6` invece di `mt-10`
- **Nuovo bottone** "Sblocca Pipo a 4,99€" — `mt-8`, stile bold, rounded-full, colore primary, apre PremiumModal al click

**3. Freccia scroll**
- Gia' presente ma solo `w-8 h-8`. Renderla piu' visibile su widescreen: `w-8 h-8 md:w-10 md:h-10`
- Aggiungere testo piccolo sopra la freccia tipo "Scorri" visibile solo su desktop

**4. Aggiungere `<PremiumModal>` nel render**
- `<PremiumModal open={premiumOpen} onOpenChange={setPremiumOpen} />` alla fine della section

### Nessun altro file da modificare

