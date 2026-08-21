/**
 * True when the error is Supabase Auth's lock-acquisition timeout. auth-js
 * serializes every auth operation behind a lock named after `storageKey`
 * ("lock:sayso-auth"); when a tab is frozen mid-operation the queued caller
 * gives up after 10s and rejects. The session itself is untouched and the SDK's
 * own refresh timer recovers, so this is benign — Sentry drops it in `beforeSend`.
 *
 * Detected via the `isAcquireTimeout` property rather than the error name or
 * message: auth-js's timeout classes extend `Error` without setting `name`, and
 * the message differs between `processLock` and `navigatorLock`. Only this flag
 * is stable across both (and is what auth-js documents callers should check).
 */
export function isLockAcquireTimeoutError(error: unknown): boolean {
    if (!error || typeof error !== 'object') return false;
    return (error as Record<string, unknown>)['isAcquireTimeout'] === true;
}
