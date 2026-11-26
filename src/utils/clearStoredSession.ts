export const SUPABASE_STORAGE_KEY = 'sayso-auth';

/**
 * Removes the Supabase session from this browser without a network call, mirroring the
 * keys auth-js clears in `_removeSession`. auth-js has no public way to do this: every
 * `signOut` scope, `local` included, calls the server first and keeps the session if that
 * fails (SAYSO-644). Throws only if localStorage itself does.
 */
export function clearStoredSession(): void {
    localStorage.removeItem(SUPABASE_STORAGE_KEY);
    localStorage.removeItem(`${SUPABASE_STORAGE_KEY}-code-verifier`);
    localStorage.removeItem(`${SUPABASE_STORAGE_KEY}-user`);
}
