

## Piano: Sostituire immagine categoria Borghi

### Cosa fare
1. Copiare la foto caricata nella cartella `public/images/` del progetto
2. Aggiornare il record `cat_image_borghi` nella tabella `site_content` del database con il nuovo percorso dell'immagine

### Dettaglio
- La foto verrà salvata come `public/images/cat-borghi.jpg`
- Il valore nel database per la chiave `cat_image_borghi` verrà aggiornato a `/images/cat-borghi.jpg`
- Nessuna modifica al codice: `HeroSection.tsx` già legge l'immagine da `useSiteContent("cat_image_borghi")`

