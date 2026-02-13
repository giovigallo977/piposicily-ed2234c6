
# Piano: Dropdown categorie nell'admin per gli hotspot

## Cosa cambia

Nel form di creazione/modifica hotspot nell'admin, il campo "Categoria" attualmente e un campo di testo libero dove puoi scrivere qualsiasi cosa. Viene sostituito con un menu a tendina (dropdown) con le 4 categorie della homepage:

- Luoghi Fantasma
- Natura
- Borghi
- Arte e Cultura

Cosi non rischi errori di battitura e gli hotspot vengono sempre collegati correttamente ai filtri della homepage.

## Dettagli tecnici

| File | Modifica |
|------|----------|
| `src/pages/Admin.tsx` | Sostituire il campo `<Input>` per "categoria" (riga ~293) con un componente `<Select>` che mostra le 4 opzioni fisse. Aggiungere import del componente Select. |

Il campo Select usera i valori esatti che gia usa la homepage (`"Luoghi Fantasma"`, `"Natura"`, `"Borghi"`, `"Arte e Cultura"`), garantendo compatibilita con i filtri esistenti nella pagina Esplora.
