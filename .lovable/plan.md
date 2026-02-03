

# Piano: Sostituire icone nel pulsante "INCONTRA PIPO"

## Situazione Attuale

Nel componente `HotspotCard.tsx` (riga 147-152), il pulsante "INCONTRA PIPO" usa queste icone:

```jsx
<span className="text-lg">👽</span>           // Emoji alieno
<Navigation className="w-4 h-4" />             // Icona freccia/bussola
{t("meetPipo")}                               // Testo tradotto
```

## Modifica Proposta

Sostituirò entrambe le icone con **un'unica icona mappa** per un look più pulito e coerente con il tema "mappe aliene":

| Prima | Dopo |
|-------|------|
| 👽 + Navigation | Map (icona mappa piegata) |

### Opzioni icona disponibili da Lucide:
- `Map` - Mappa piegata classica ✅ **Consigliata**
- `MapPin` - Solo il pin
- `MapPinned` - Mappa con pin

## File da Modificare

| File | Modifica |
|------|----------|
| `src/components/HotspotCard.tsx` | Importare `Map` al posto di `Navigation`, rimuovere emoji alieno |

## Codice Finale

```jsx
import { Map } from "lucide-react";

// Nel pulsante:
<a className="...">
  <Map className="w-5 h-5" />
  {t("meetPipo")}
</a>
```

## Risultato Visivo

Il pulsante passerà da:
- **👽 ➜ INCONTRA PIPO** 

A:
- **🗺️ INCONTRA PIPO** (con icona mappa Lucide)

Look più professionale e coerente con il messaggio "sblocca mappa aliena".

