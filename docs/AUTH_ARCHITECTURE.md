# Auth Architecture — Sayso Web App

> **Audience:** Any developer touching auth in this repo.
> **Last updated:** May 2026 (post SAYSO-135 hardening).
> **Companion:** `client/docs/AUTH_ARCHITECTURE.md` covers the Electron desktop app. That doc has more depth on the original root-cause analysis — worth reading if you want the full picture.

---

## TL;DR

The Supabase JS SDK owns the session. `AuthContext` is a React mirror — it listens, it never writes tokens. Axios reads from the SDK before every request. Nothing in application code calls `refreshSession()` except the low-level `useSessionRevalidation` hook. If you respect those three rules, sessions are permanent until the user signs out.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Supabase JS SDK                          │
│  (single source of truth — owns tokens + refresh schedule) │
└───────────────┬─────────────────────────────────────────────┘
                │  events: INITIAL_SESSION, SIGNED_IN,
                │  SIGNED_OUT, TOKEN_REFRESHED, USER_UPDATED
                ▼
┌───────────────────────────┐       ┌──────────────────────────┐
│     AuthContext.tsx        │       │      axios.ts             │
│  (React mirror)            │       │  (HTTP layer)             │
│  - user, authToken, MFA   │       │  - getSession() per req   │
│  - onAuthStateChange sub  │       │  - 401 → refreshSession() │
│  - resetUser on expiry    │       │  - error classification   │
└──────────┬────────────────┘       └──────────────────────────┘
           │                                    │
    ┌──────▼──────┐  ┌────────────┐    ┌───────▼──────────┐
    │  AuthGuard  │  │  MFAGuard  │    │  useSessionRevalid│
    │  (routes)   │  │  (routes)  │    │  (AFK/online hook)│
    └─────────────┘  └────────────┘    └──────────────────┘
```

**One rule to remember:** The SDK refreshes. Everyone else asks.

---

## Key Files

| File | Role |
|---|---|
| `src/config/supabase.ts` | Creates the Supabase client (plain `localStorage`, `storageKey: 'sayso-auth'`). One singleton used everywhere. |
| `src/context/AuthContext.tsx` | React state mirror. Bootstraps from `INITIAL_SESSION` / `getSession()`. Listens to `onAuthStateChange`. Exposes `signIn`, `signOut`, `verifyMFA`, and all user/MFA state. |
| `src/config/axios.ts` | `apiClient` instance. Reads token via `getSession()` on every request. Handles 401 → refresh → retry. Classifies refresh errors: only terminal Supabase errors force a logout. |
| `src/hooks/useSessionRevalidation.ts` | Listens to `visibilitychange` and `online` events. Forces a refresh if the token is within 60s of expiry. Compensates for browser tab-throttling that delays the SDK's internal timer. |
| `src/components/AuthGuard.tsx` | Route wrapper: redirects to `/login` if not authenticated. |
| `src/components/MFAGuard.tsx` | Route wrapper: redirects to `/mfa-verify` if `mfaRequired` is true. |
| `src/services/mfaServices.ts` | MFA enrollment and verification helpers (TOTP). Calls Supabase SDK directly. |
| `src/utils/tokenEncryption.ts` | Legacy — no longer used by the Supabase client. `debugStorage.ts` still imports it for dev console tooling. Do not add new usages. |

---

## Token Lifecycle

### Where tokens live

| Token | Location | Survives page reload? |
|---|---|---|
| Access token | SDK in-memory + `localStorage['sayso-auth']` (JSON) | Yes |
| Refresh token | `localStorage['sayso-auth']` (JSON) | Yes |

The `sayso-auth` key contains a JSON blob with the full Supabase session object. It is unencrypted plain JSON — the previous `cryptoStorage` adapter was removed in SAYSO-135 because the encryption key was bundled into the client JS (security theater) and introduced async race conditions.

### Birth

Three entry points:
1. **`signIn(email, password)`** → `supabase.auth.signInWithPassword()` → SDK stores the session.
2. **`supabase.auth.signUp()`** → same storage path.
3. **App boot** → SDK reads `localStorage['sayso-auth']` and fires `INITIAL_SESSION`.

### Life — the refresh schedule

The SDK runs its own proactive refresh timer (`autoRefreshToken: true` by default). It fires ~60 seconds before the access token expires (Supabase JWTs are 1 hour by default). The `useSessionRevalidation` hook is a safety net that fires an explicit refresh check whenever the tab becomes visible or the device comes back online — covering cases where the browser throttled the SDK's `setTimeout` while the tab was in the background.

### Death

| Trigger | What happens |
|---|---|
| User calls `handleSignOut()` | `supabase.auth.signOut()` → SDK emits `SIGNED_OUT` → `AuthContext` calls `resetUser()`. |
| Refresh token revoked by Supabase | SDK detects this during refresh → emits `SIGNED_OUT` → same path. |
| `isTerminalAuthError` in axios | 401 retry failed with `AuthApiError` 400/401 or `AuthSessionMissingError` → `auth:session-expired` DOM event → `AuthContext.resetUser()`. |

---

## Auth Flows

### App boot

```
Browser loads app
  └─ supabase.ts module initializes the client
  └─ AuthProvider mounts
        ├─ supabase.auth.getSession()
        │     └─ reads localStorage['sayso-auth']
        │     └─ setUser(session.user) + setLoading(false)
        │
        └─ supabase.auth.onAuthStateChange(handler) ← mounted once, never re-subscribed
              └─ fires INITIAL_SESSION immediately with the stored session (or null)
                    └─ handler: setUser, setAuthToken, setLoading(false)

  If session found → AuthGuard lets the app render normally
  If no session    → AuthGuard redirects to /login
```

### Sign-in (no MFA)

```
User submits email + password
  └─ AuthContext.signIn()
        └─ supabase.auth.signInWithPassword({ email, password })
              └─ Supabase returns { user, session }
              └─ SDK writes session to localStorage['sayso-auth']
              └─ SDK emits SIGNED_IN
                    └─ onAuthStateChange handler: setUser, setAuthToken
        └─ returns { data: { user, session }, error: null }
  └─ useLoginForm: navigates to /
  └─ AuthGuard: user is set → renders the app
```

### Sign-in with MFA enrolled

```
User submits email + password
  └─ AuthContext.signIn()
        └─ supabase.auth.signInWithPassword() → returns aal1 session
        └─ AuthContext: checkMFAStatus()
              └─ getAAL() → currentLevel: 'aal1', nextLevel: 'aal2'
              └─ listFactors() → [{ id, type: 'totp' }]
              └─ setMfaRequired(true), setCurrentAAL('aal1'), setMfaFactors([...])
  └─ useLoginForm: navigates to /mfa-verify
  └─ MFAGuard: mfaRequired=true → renders MFA TOTP input

User enters TOTP code
  └─ AuthContext.verifyMFA(code)
        └─ verifyTOTPCode(factorId, code) → supabase.auth.mfa.challengeAndVerify()
              └─ Supabase returns aal2 session
              └─ SDK emits SIGNED_IN with aal2 tokens
                    └─ setUser, setAuthToken
        └─ setMfaRequired(false), setCurrentAAL('aal2')
  └─ navigate to /
```

### Token refresh (proactive — normal operation)

```
[SDK's internal timer fires ~59 min after last sign-in/refresh]
  └─ SDK calls Supabase /auth/v1/token?grant_type=refresh_token
        └─ Supabase rotates: old refresh token invalidated, new pair returned
        └─ SDK writes new session to localStorage['sayso-auth']
        └─ SDK emits TOKEN_REFRESHED
              └─ onAuthStateChange handler: setAuthToken(new access_token)
```

The user never sees a 401 in normal operation because the proactive refresh fires before expiry.

### Token refresh (reactive — on 401)

```
[Request returns 401 — e.g. clock skew, late proactive refresh]
  └─ axios response interceptor (originalRequest._retry not set)
        └─ originalRequest._retry = true
        └─ supabase.auth.refreshSession()
              └─ SDK acquires navigator.locks mutex (serializes concurrent calls)
              └─ Exchanges refresh token with Supabase
              └─ If success: writes new session, emits TOKEN_REFRESHED
              └─ If terminal failure (AuthApiError 400/401): emits SIGNED_OUT
        └─ If refreshSession succeeded:
              └─ attach new Bearer token to originalRequest
              └─ retry once → return response
        └─ If refreshSession failed:
              └─ isTerminalAuthError(err)?
                    YES → Sentry.captureException + dispatch 'auth:session-expired'
                          → AuthContext.resetUser() → redirect to /login
                    NO  → Sentry.addBreadcrumb (transient) + reject
                          → session preserved, request error surfaces normally
```

### AFK / tab wake-up

```
[User returns to tab after AFK (tab was backgrounded, timers throttled)]
  └─ visibilitychange event fires (document.visibilityState === 'visible')
  └─ useSessionRevalidation: revalidate()
        └─ supabase.auth.getSession()
        └─ if session.expires_at * 1000 - now < 60_000:
              └─ supabase.auth.refreshSession()
                    └─ if success → SDK emits TOKEN_REFRESHED → user stays signed in
                    └─ if failure → SDK emits SIGNED_OUT → user redirected to /login
```

### Sign-out

```
User clicks "Sign Out"
  └─ AuthContext.handleSignOut()
        └─ supabase.auth.signOut()
              └─ SDK clears localStorage['sayso-auth']
              └─ SDK emits SIGNED_OUT
                    └─ onAuthStateChange: setUser(null), setAuthToken(null)
        └─ resetUser() — synchronous local state clear
  └─ AuthGuard: user is null → redirect to /login
```

### Session expired (terminal)

Triggered either by `isTerminalAuthError` in axios or the SDK's own `SIGNED_OUT` emit on refresh failure.

```
window.dispatchEvent(new CustomEvent('auth:session-expired'))
  └─ AuthContext useEffect listener:
        └─ resetUser() → user=null, globalUser=null, authToken=null, MFA state cleared
  └─ AuthGuard: user=null → redirect to /login
```

---

## The SAYSO-135 Postmortem

**Symptom:** users (and devs) were kicked to `/login` after going AFK. Reproducible in development; production exposure was low but real.

**Root causes (two, both fixed):**

1. **Dual refresh paths.** The SDK's `autoRefreshToken` ran a proactive refresh on a `setTimeout`. Separately, the axios 401 handler called `supabase.auth.refreshSession()` directly. With the async `cryptoStorage` adapter (PBKDF2, 100k iterations per read/write), the SDK's `navigator.locks` coordination was slower, widening the window for both refresh paths to use the same (already-rotated) refresh token. Supabase's 10-second reuse window is a safety net; outside that window it assumes the token was leaked and revokes the session.

2. **Any refresh error = forced logout.** The axios 401 handler dispatched `auth:session-expired` in its `catch` block unconditionally — including for `ERR_NETWORK`, timeouts, and cold-start backend delays. Tab wake-up is exactly when these transient errors spike.

**What changed:**
- `cryptoStorage` removed → plain `localStorage` → SDK lock is synchronous → no async race window.
- `isTerminalAuthError()` in `axios.ts` → only `AuthApiError` (HTTP 400/401) or `AuthSessionMissingError` trigger logout. Everything else is a breadcrumb.
- `onAuthStateChange` subscription moved to mount-scoped (`[]` dep) → no subscription gap between navigations.
- `useSessionRevalidation` added → explicit refresh on tab focus and network restore.

**Same class of bug** as the Electron desktop app's SAYSO-129 (April–May 2026). The desktop fix was more drastic (moved all auth out of the renderer into the main process). The web fix is lighter because in a browser there is only one process — the SDK already owns tokens; we just had to stop competing with it.

---

## Rules — What Not to Do

1. **Never call `supabase.auth.refreshSession()` in application code.** The only place that's allowed is `useSessionRevalidation.ts` and the axios 401 handler. If you need a fresh token, call `supabase.auth.getSession()` — the SDK will refresh if needed.

2. **Never cache an access token in React state, Zustand, or any variable that outlives a single async call.** `supabase.auth.getSession()` is fast (synchronous localStorage read). Always ask fresh.

3. **Never dispatch `auth:session-expired` except in response to a confirmed terminal Supabase error.** The `isTerminalAuthError()` helper in `axios.ts` is the canonical check. If you're adding a new code path that handles auth failures, use it.

4. **Never add a second `onAuthStateChange` subscription.** One subscription in `AuthContext` handles all windows of auth state. Adding another creates duplicate state updates and ordering bugs.

5. **Never re-introduce a custom async storage adapter for the Supabase client.** The `cryptoStorage` was removed deliberately. If you feel the urge to encrypt session data, remember: the encryption key would live in the JS bundle, making the encryption worthless. Rely on HTTPS + Supabase's own token protections.

6. **If you add a long-running connection (WebSocket, SSE) that uses a JWT, subscribe to `TOKEN_REFRESHED` and call `updateToken()`.** Otherwise it silently uses a stale token after the next refresh.

---

## Debugging Playbook

### "User lands on /login without clicking sign out"

Check in order:
1. **Console:** did "Session expired event received" log? If yes → `isTerminalAuthError` decided it was terminal. Check what `refreshError` was.
2. **Network tab:** filter `token`. Did a `/auth/v1/token?grant_type=refresh_token` call return 400? That's a real expired session. Did it fail with `ERR_NETWORK`? Then `isTerminalAuthError` should have returned false and NOT logged out — investigate if it did.
3. **Application tab → Local Storage:** is `sayso-auth` present? If missing → sign-out path cleared it. If present → the `SIGNED_OUT` event cleared React state but didn't touch storage (that's a sign of a race — rare).

### "App hangs on loading spinner"

`AuthContext` sets `loading=true` initially and `false` after `getSession()` resolves OR `INITIAL_SESSION` fires. If neither fires:
- Check if `supabase.ts` imported correctly (no circular import, env vars set).
- Check if `AuthProvider` is inside `<BrowserRouter>` (it uses `useLocation`).
- Check the console for a Supabase client init error.

### "MFA prompt doesn't appear after sign-in"

`checkMFAStatus()` in `AuthContext` calls `getAAL()` and `listFactors()` from `mfaServices.ts`. If it returns false:
- Open DevTools → Network → look for the `/auth/v1/factors` response. Is the factor there with `status: 'verified'`?
- Check `getAAL()` response: is `currentLevel: 'aal1'` and `nextLevel: 'aal2'`?
- `checkIfNeedsMFA` requires both to be non-null.

### "Token refresh seems to loop"

Check `originalRequest._retry` — if something resets it, the 401 handler will retry infinitely. Grep for `_retry`. The `_retry` flag must only ever be set to `true`, never cleared.

### Useful debug snippets (browser console)

```js
// Current session snapshot
await supabase.auth.getSession()

// Is the access token about to expire?
const s = (await supabase.auth.getSession()).data.session
new Date(s.expires_at * 1000)  // human-readable expiry

// Force the session-expired UX (doesn't actually revoke session)
window.dispatchEvent(new CustomEvent('auth:session-expired'))

// Corrupt the refresh token to test terminal-error path
const v = JSON.parse(localStorage.getItem('sayso-auth'))
v.refresh_token = 'bad-' + v.refresh_token
localStorage.setItem('sayso-auth', JSON.stringify(v))
// Now make any API call → should log you out
```

---

## Multi-Tab Behavior

The Supabase JS SDK uses the [Web Locks API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Locks_API) to serialize all session mutations (refresh, sign-in, sign-out) across tabs sharing the same `localStorage` origin. Combined with plain synchronous `localStorage`:

- Two tabs trying to refresh at the same time → one wins, the other waits, then reads the already-refreshed session → only one Supabase network call.
- One tab signs out → `SIGNED_OUT` event propagates to other tabs via the `storage` event → all tabs redirect to `/login`.

No application-level coordination is needed.

---

*Last updated: May 2026. PR: SAYSO-135. Authors: Lucas + Claude.*
