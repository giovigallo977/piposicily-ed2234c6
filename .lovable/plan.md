

# Importazione 2 Hotspot da JSON

## Cosa faremo

Inseriremo i 2 nuovi hotspot nel database, combinando tutti i campi extra del JSON in un'unica `descrizione_completa` formattata. Il frontend si aggiornerà automaticamente.

## Mapping dei campi

| Campo JSON | Campo DB |
|---|---|
| `titolo` | `titolo` |
| `descrizione_breve` | `descrizione_breve` |
| `perche_pipo_ama` + `approfondimenti` + `cosa_vedere` + `pit_stop` + `nei_intorni` + `manto_stradale` + `parcheggio` + `radar_distanze` | `descrizione_completa` (testo unico formattato) |
| `tag` | `tags` |
| `categoria` | `categoria` |
| `link_maps` | `link_google_maps` |
| (non presente) | `zona` = "" |
| (non presente) | `foto_principale` = "" |
| (non presente) | `foto_gallery` = [] |

## Ordine

Gli hotspot esistenti arrivano fino a ordine 16. I nuovi saranno:
- Labirinto di Arianna: ordine 17
- Piramide 38 Parallelo: ordine 18

## Formato della descrizione_completa

Per ogni hotspot, la descrizione completa sarà composta cosi:

```text
Perché Pipo lo ama
[testo perche_pipo_ama]

Approfondimenti
[testo approfondimenti]

Cosa vedere
- [elemento 1]
- [elemento 2]
- ...

Pit Stop
[testo pit_stop]

Nei dintorni
- [elemento 1]
- [elemento 2]
- ...

Manto stradale
[testo manto_stradale]

Parcheggio
[testo parcheggio]

Radar distanze
- Palermo: [distanza]
- Catania: [distanza]
- ...
```

## Dettagli tecnici

Verranno eseguite 2 query INSERT nella tabella `hotspots` tramite il tool di inserimento dati. Nessuna modifica a file di codice o schema del database necessaria: il frontend legge già dinamicamente dalla tabella hotspots.
