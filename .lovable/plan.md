

## Obiettivo

Aggiungere una CTA sobria sotto la griglia categorie (dopo "Arte e Cultura" e "Free Spots") con testo per contattarvi su Instagram.

## Modifiche

### `src/contexts/LanguageContext.tsx`
Aggiungere nuove chiavi di traduzione:
- IT: `contactCta: "Per info e consigli non esitare a contattarci"`, `igHandle: "IG: pipo.fuoriradar"`
- EN: `contactCta: "For info and tips don't hesitate to contact us"`, `igHandle: "IG: pipo.fuoriradar"`

### `src/components/HeroSection.tsx`
Dopo la chiusura del `</div>` della griglia categorie (il `grid grid-cols-2`), aggiungere un blocco testuale centrato e sobrio:
- Testo tradotto `t("contactCta")` in stile `text-sm text-muted-foreground`
- Link cliccabile a `https://instagram.com/pipo.fuoriradar` con il testo `t("igHandle")` in stile `font-medium` con hover underline
- Padding `mt-6`, tutto centrato

