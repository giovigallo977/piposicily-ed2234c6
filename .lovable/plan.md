

## Inserire Google Analytics (gtag.js)

### Cosa fare
Aggiungere il tag Google Analytics `G-GGT28V4PNP` nel file `index.html`, subito dopo l'apertura del tag `<head>`.

### Modifica
**File: `index.html`** — Inserire lo snippet gtag.js dopo `<head>`:

```html
<head>
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-GGT28V4PNP"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-GGT28V4PNP');
    </script>
    <meta charset="UTF-8" />
    ...
```

Essendo una SPA (Single Page App), il tag si carica una sola volta e Google Analytics traccerà automaticamente le pageview. Nessun altro file da modificare.

