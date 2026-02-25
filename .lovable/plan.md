

# Diagnosi: Errore Hooks, Non un Problema di Cache

## Cosa sta succedendo

Il problema NON era la mancanza di realtime. React Query aggiorna gia i dati automaticamente quando l'utente naviga o torna sulla pagina. I tuoi hotspot si caricavano correttamente prima.

L'errore attuale visibile nei log della console e:

```text
React has detected a change in the order of Hooks called by HeroSection
Previous render: hook 14 = useContext
Next render:     hook 14 = useEffect
```

Questo succede perche la modifica a `useHotspots.tsx` (aggiunta di `useQueryClient` + `useEffect`) ha cambiato il numero di hooks interni. Il sistema di hot-reload non gestisce questo cambio e causa un crash del componente.

## Soluzione

**Nessuna modifica al codice necessaria.** La modifica realtime che abbiamo fatto e corretta e funzionante. Il problema e solo il hot-reload.

Un **refresh completo della pagina** (F5 o Ctrl+R) nella preview risolve l'errore immediatamente. Dopo il refresh, tutti gli hotspot appariranno correttamente, e in piu avrai il beneficio del realtime istantaneo.

## Riepilogo

| Prima | Dopo |
|-------|------|
| Hotspot si aggiornano quando cambi tab o navighi | Hotspot si aggiornano **istantaneamente** senza azioni |
| Funzionava gia bene | Funziona meglio + errore temporaneo da hot-reload |

Nessun file da modificare. Solo un refresh della preview.

