

# Fix: bloccare espansione card locked

## Problema
Il bottone "+" dentro `HotspotCard.tsx` chiama `setIsExpanded(!isExpanded)` senza verificare se la card è `locked`. Il click wrapper esterno gestisce solo il click generico sulla card, ma il bottone ha il suo handler separato che bypassa il controllo.

## Soluzione
In `HotspotCard.tsx`, modificare l'`onClick` del bottone espansione (riga ~107): se `locked`, chiamare `onLockedClick()` invece di `setIsExpanded`.

```
onClick={() => {
  if (locked) {
    onLockedClick?.();
    return;
  }
  setIsExpanded(!isExpanded);
}}
```

Un solo file modificato: `src/components/HotspotCard.tsx`.

