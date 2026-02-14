
# Piano: Importazione 10 hotspot nel database

## Cosa viene fatto

Inserimento diretto nel database di 10 nuovi hotspot (Piano Battaglia esiste gia, viene saltato). Tutti avranno la **categoria vuota** cosi potrai assegnarla tu dall'admin.

## Hotspot da inserire

| # | Titolo | Zona | Ordine |
|---|--------|------|--------|
| 1 | Poggioreale Vecchia | Palermo | 1 |
| 2 | Argimusco | Messina | 3 |
| 3 | Il Cretto di Burri | Palermo | 3 |
| 4 | Castello di Pietratagliata o Gresti | Catania | 4 |
| 5 | Villa Romana del Casale | Agrigento | 5 |
| 6 | Geraci Siculo e Castello | Agrigento | 6 |
| 7 | Real Casina di Caccia di Ficuzza | Palermo | 8 |
| 8 | Geoparco Rocca di Cerere | Enna | 9 |
| 9 | Castello di Sperlinga | Enna | 10 |
| 10 | Lago Maulazzo | Catania | 11 |

## Dettagli tecnici

- **Metodo**: 10 INSERT nella tabella `hotspots` tramite lo strumento di inserimento dati
- **Categoria**: stringa vuota per tutti (da completare manualmente nell'admin)
- **Foto**: gli URL delle immagini puntano al vecchio storage Supabase (`uepfkcuuqhxodtlzvrsb`), verranno inseriti cosi -- funzioneranno finche quel bucket e pubblico
- **Piano Battaglia**: gia presente nel database, viene saltato (ordine aggiornato se necessario)
- **Nessuna modifica al codice frontend**: la struttura delle card e dell'admin e gia pronta per mostrare e modificare tutti gli hotspot

## Nota sulle immagini
Le foto puntano a un altro progetto Supabase. Funzioneranno perche il bucket e pubblico, ma se in futuro vuoi migrare le immagini nel nuovo storage potrai ricaricarle dall'admin.
