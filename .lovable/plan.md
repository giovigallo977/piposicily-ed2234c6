

## Problem

User signups are disabled in the authentication configuration. When a new user tries to register via the Premium modal, the backend rejects the request with "422: Signups not allowed for this instance."

## Root Cause

The authentication system is configured to block new user registrations. This was likely set intentionally to restrict access to admin-only, but the premium payment flow requires public signups.

## Plan

1. **Enable user signups** using the authentication configuration tool — toggle "Enable Signups" to `true`.

2. **Keep email confirmation enabled** — users should verify their email before gaining access, as per current best practices. The existing `PremiumModal` already handles this flow (shows "check your email" toast after signup).

No code changes are needed — this is purely a backend configuration change.

## Technical Detail

The auth logs show repeated `signup_disabled` errors:
```
"error_code": "signup_disabled"
"error": "422: Signups not allowed for this instance"
```

The fix is a single configuration toggle on the authentication system.

