

## Problems Identified

From the screenshots, there are 3 distinct issues:

1. **Popup blocked**: `window.open(data.url, "_blank")` in `PremiumModal.tsx` is blocked by mobile browsers because it's called inside an async function (not directly from a user click event). Mobile Safari is especially strict about this.

2. **Payment verification error**: The `/payment-success` page shows "Errore nella verifica" because when the user opens Stripe Checkout in a new tab, the session/auth context in the original tab may not carry over. Also, the user might not be logged in on the payment-success page if they opened it from a different tab.

3. **404 on payment-success**: The third screenshot shows a 404, which means the published app's hosting is not configured to handle SPA client-side routes. The `/payment-success` route exists in React Router but the server returns 404 for direct navigation. However, looking at App.tsx, the route IS defined. This 404 might be from navigating to `/explore` (line 59/66) which doesn't exist -- the actual route is `/esplora`.

## Plan

### 1. Fix popup blocker -- Use `window.location.href` instead of `window.open`

In `PremiumModal.tsx`, change `window.open(data.url, "_blank")` to `window.location.href = data.url`. This redirects the current page to Stripe Checkout instead of opening a new tab, avoiding popup blockers entirely. The modal closes naturally, and after payment Stripe redirects back to `/payment-success`.

### 2. Fix the navigate route on PaymentSuccess

In `PaymentSuccess.tsx`, the buttons navigate to `/explore` but the actual route is `/esplora`. Change both `navigate("/explore")` to `navigate("/esplora")`.

### 3. Fix verification when user is not logged in

The payment-success page requires the user to be authenticated to call `verify-payment`. Since the user is redirected back from Stripe (same browser, same tab with the location.href fix), the auth session should persist. But add a fallback: if no user after a few seconds, still show a success-like message directing them to explore, and let `usePremiumStatus` handle verification on next page load.

### Technical Details

**File: `src/components/PremiumModal.tsx`** (line 70)
- Change: `window.open(data.url, "_blank")` to `window.location.href = data.url`

**File: `src/pages/PaymentSuccess.tsx`** (lines 59, 66)
- Change: `navigate("/explore")` to `navigate("/esplora")` (x2)
- Add handling for unauthenticated users landing on this page (show a generic success message with redirect)

