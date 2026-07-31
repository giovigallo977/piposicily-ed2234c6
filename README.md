# Pipo Sicily

Prompt per Lovable (Layout Editoriale + Espansione)
"Crea una PWA con un layout pulito ed editoriale ispirato a una rivista di fotografia, seguendo queste specifiche:

Struttura della Card:

Immagine: Una card con bordi arrotondati (20px), ma leggermente più quadrata rispetto al formato mobile standard. Non deve andare a filo schermo (lascia del padding laterale).

Contenuto sotto la foto (Area Bianca): Il testo non è sopra la foto, ma subito sotto su sfondo bianco pulito.

Titolo: 'Nome Borgo' in grassetto (font sans-serif elegante), allineato a sinistra.

Descrizione Breve: Una riga di testo subito sotto il titolo.

Tasto Espansione: Allineato al Titolo, ma all'estrema destra, inserisci un piccolo tasto '+' circolare.

Interattività (Espansione):

Al click sul tasto '+', la card si espande verso il basso con un'animazione fluida (Accordion).

Contenuto Espanso: Mostra la descrizione completa e una galleria di altre 2-3 foto del borgo.

Una volta espanso, il tasto '+' diventa un '-'.

Tasto Naviga:

Inserisci un tasto 'NAVIGA' (colore verde oliva/naturale) posizionato sotto la descrizione breve. Deve essere ben visibile e collegato a un link esterno di Google Maps.

Stile Generale:

Padding generoso tra le schede.

Sfondo dell'app bianco per far risaltare le foto.

Focus totale sulla qualità fotografica e sulla leggibilità del testo (stile Aperture.org)."5. Gestione Dati Manuale (MOLTO IMPORTANTE):

Struttura il codice in modo che ci sia un array di oggetti JavaScript (o una costante) chiaramente identificabile nel codice.

Ogni oggetto deve contenere: titolo, descrizioneBreve, descrizioneCompleta, fotoPrincipale, fotoGallery (array di link), e linkGoogleMaps.

In questo modo, io potrò aggiungere o modificare manualmente i contenuti (hotspot) semplicemente aggiornando questo array."

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://piposicily.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/325c1d2a-8aeb-430a-b245-458b6ce405ef).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
