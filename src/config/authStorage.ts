export const SUPABASE_STORAGE_KEY = 'sayso-auth';
export const AUTH_REQUEST_TIMEOUT_MS = 10_000;

/**
 * Removes the Supabase session from this browser without a network call, mirroring the
 * keys auth-js clears in `_removeSession`. auth-js has no public way to do this: every
 * `signOut` scope, `local` included, calls the server first and keeps the session if that
 * fails (SAYSO-644). The session key goes last, so a throw never leaves it half cleared.
 * Throws only if localStorage itself does.
 */
export function clearStoredSession(): void {
    localStorage.removeItem(`${SUPABASE_STORAGE_KEY}-code-verifier`);
    localStorage.removeItem(`${SUPABASE_STORAGE_KEY}-user`);
    localStorage.removeItem(SUPABASE_STORAGE_KEY);
}

/**
 * auth-js sets no timeout on its requests, and a hung one holds the auth lock, blocking every
 * later auth call in the tab (a sign-out would never settle, nor would the next sign-in's MFA
 * check). Bounding the request makes auth-js fail on its own, release the lock and return
 * the usual retryable error.
 */
export const fetchWithTimeout: typeof fetch = (input, init) =>
    fetch(input, { ...init, signal: init?.signal ?? AbortSignal.timeout(AUTH_REQUEST_TIMEOUT_MS) });
