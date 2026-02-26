

## Aggiungere hint spam in PaymentSuccess

### File: `src/pages/PaymentSuccess.tsx`

**1.** Aggiungere `spamHint` alle traduzioni IT (riga 28) e EN (riga 39):
- IT: `"Se non trovi l'email, controlla anche nella cartella spam."`
- EN: `"If you don't see the email, check your spam folder too."`

**2.** Nel blocco "completed" (dopo riga 137, sotto l'email mostrata), aggiungere:
```tsx
<p className="text-xs text-muted-foreground italic">{t.spamHint}</p>
```

Nessun altro file da modificare.

