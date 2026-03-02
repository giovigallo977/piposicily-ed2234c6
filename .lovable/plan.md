

## Piano: Fix bottone "Salva Hero" disabilitato

### Problema

Il bottone "Salva Hero" (riga 728-732) ha una condizione `disabled` che controlla solo `heroHeadline`, `heroSubtitle` e `homepageBgColor`. Non include `heroBgImage`, quindi quando cambi solo l'immagine di sfondo il bottone resta disabilitato.

### Fix in `src/pages/Admin.tsx` (righe 728-732)

Aggiungere il confronto `heroBgImage === (heroBgImageContent?.content || "")` alla condizione disabled:

```typescript
disabled={updateSiteContent.isPending || (
  heroHeadline === heroHeadlineContent?.content && 
  heroSubtitle === heroSubtitleContent?.content && 
  homepageBgColor === (homepageBgColorContent?.content || "") &&
  heroBgImage === (heroBgImageContent?.content || "")
)}
```

Nessun altro file da modificare.

