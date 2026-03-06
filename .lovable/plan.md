

## Problema trovato

I dati nel database mostrano che **Villa Malfitano** e **Giardino Inglese** hanno la categoria vuota (`""`) invece di `"Palermo Liberty"`. Non è un bug del codice ma un dato errato nel database.

### Causa probabile
Quando hai modificato la categoria di questi hotspot, il salvataggio potrebbe non essere andato a buon fine, oppure il campo categoria è stato sovrascritto con un valore vuoto.

### Correzione

**Aggiornamento dati nel database** — Impostare `categoria = 'Palermo Liberty'` per i due hotspot:
- `Villa Malfitano` (id: `7648426f-5a24-47e3-aa1d-221ff8ffa6c5`)
- `Giardino Inglese` (id: `9acff83b-0d62-4c3f-bb84-55466a9ce9dc`)

Nessuna modifica al codice necessaria.

