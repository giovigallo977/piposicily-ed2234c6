
# Piano: Correzione problema di isolamento dati negli Hotspot

## Problema identificato

Ho trovato un bug critico nel pannello Admin che causa "contaminazione" dei dati tra hotspot diversi.

### Evidenza nel database

L'hotspot "Poggioreale Vecchia" ha una `descrizione_breve` che contiene CHIARAMENTE due descrizioni diverse concatenate:

```
"Pipo dice che se ci vai al tramonto, capisci meglio perché preferisce le stelle alla cittàNon è un rudere, è un fermo immagine del 1968..."
```

Nota come non c'è nemmeno uno spazio tra "città" e "Non" - due testi diversi sono stati fusi insieme.

### Causa tecnica

Nel componente `Admin.tsx`, il dialog di modifica ha questo problema:

```jsx
<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
```

Quando il dialog viene chiuso cliccando fuori o premendo ESC (`onOpenChange` viene chiamato con `false`), il form **NON viene resettato**. Il `formData` mantiene i valori precedenti.

**Scenario di contaminazione:**
1. Utente apre hotspot A e modifica la descrizione
2. Utente chiude il dialog cliccando fuori (senza salvare)
3. Utente apre hotspot B per modificarlo
4. In alcuni casi, i dati del form potrebbero mescolarsi

## Soluzione proposta

### 1. Aggiungere un handler per il reset del form alla chiusura del dialog

```text
+---------------------+       +---------------------+
| Dialog onOpenChange |------>| handleDialogChange  |
+---------------------+       +---------------------+
                                      |
                              +-------v-------+
                              | if (!open) {  |
                              |   reset form  |
                              |   clear state |
                              | }             |
                              +---------------+
```

### 2. Modifiche al codice

| File | Modifica |
|------|----------|
| `src/pages/Admin.tsx` | Aggiungere `handleDialogChange` che resetta il form quando il dialog viene chiuso |

**Nuovo codice:**

```jsx
// Nuova funzione per gestire apertura/chiusura dialog
const handleDialogChange = (open: boolean) => {
  setIsDialogOpen(open);
  if (!open) {
    // Reset del form quando il dialog viene chiuso
    setEditingHotspot(null);
    setFormData({ ...emptyHotspot });
  }
};

// Nel JSX, sostituire:
<Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
```

### 3. Correggere anche handleSubmit per sicurezza

Dopo il salvataggio, resettare esplicitamente il form:

```jsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (editingHotspot) {
    await updateMutation.mutateAsync({ id: editingHotspot.id, updates: formData });
  } else {
    await createMutation.mutateAsync(formData);
  }
  
  // Reset esplicito dopo il salvataggio
  setEditingHotspot(null);
  setFormData({ ...emptyHotspot });
  setIsDialogOpen(false);
};
```

## Dati corrotti esistenti

L'hotspot "Poggioreale Vecchia" ha dati corrotti che andranno corretti manualmente dal pannello Admin dopo aver applicato questa fix.

## Riepilogo

| Azione | Descrizione |
|--------|-------------|
| Fix primaria | Aggiungere `handleDialogChange` per resettare il form alla chiusura |
| Fix secondaria | Resettare esplicitamente il form dopo `handleSubmit` |
| Azione manuale | Correggere i dati di "Poggioreale Vecchia" dal pannello Admin |
