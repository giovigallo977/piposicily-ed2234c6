

# Piano: Sostituire icone Login/Logout con testo

## Problema
Attualmente il pulsante Login/Logout usa un'icona freccia (`LogIn` di Lucide) che non si capisce. L'utente vuole testo chiaro: **"Login"** quando non sei loggato, **"Logout"** quando sei loggato.

## Modifiche

Sostituire in **tutti e 5 i file** l'icona `LogIn` con testo semplice:

### File da modificare

| File | Riga |
|------|------|
| `src/components/MinimalHeader.tsx` | righe 60-68 |
| `src/pages/ExplorePage.tsx` | righe 64-72 |
| `src/pages/CollectionsPage.tsx` | righe 23-31 |
| `src/pages/CollectionDetailPage.tsx` | righe 43-51 |
| `src/pages/FreeSpotsPage.tsx` | righe 25-33 |

### Cosa cambia

Da:
```tsx
<button ...><LogIn className="w-6 h-6 text-foreground" /></button>
// oppure
<button ...><LogIn className="w-6 h-6 text-foreground rotate-180" /></button>
```

A:
```tsx
<button onClick={() => setPremiumModalOpen(true)}
  className="text-sm font-medium text-foreground hover:opacity-70 transition-opacity">
  Login
</button>
// oppure
<button onClick={() => signOut()}
  className="text-sm font-medium text-foreground hover:opacity-70 transition-opacity">
  Logout
</button>
```

L'import di `LogIn` da Lucide verra rimosso da tutti i file dove non serve piu.

Nessuna modifica alla logica: cliccando "Login" si apre il PremiumModal (che chiede di sbloccare l'app), cliccando "Logout" si esce.

