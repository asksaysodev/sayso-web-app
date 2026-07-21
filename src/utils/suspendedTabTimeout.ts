const SUSPENDED_TAB_TIMEOUT_FLAG = '__saysoSuspendedTabTimeout';

/**
 * Marks a timeout as the artifact of a suspended tab rather than a slow backend.
 * When the machine sleeps (or the browser freezes a background tab) with a request
 * in flight, the XHR is abandoned and `ontimeout` only fires on wake — so axios
 * reports `ECONNABORTED` minutes or hours after the configured timeout. Nothing
 * was actually slow, and nobody was watching, so it is not a defect.
 */
export function markSuspendedTabTimeout(error: unknown): void {
    if (!error || typeof error !== 'object') return;
    (error as Record<string, unknown>)[SUSPENDED_TAB_TIMEOUT_FLAG] = true;
}

/**
 * True when the error was flagged by {@link markSuspendedTabTimeout}. Sentry drops
 * these in `beforeSend`; genuine timeouts are left untouched so a real backend
 * degradation still reaches the issue stream.
 */
export function isSuspendedTabTimeoutError(error: unknown): boolean {
    if (!error || typeof error !== 'object') return false;
    return (error as Record<string, unknown>)[SUSPENDED_TAB_TIMEOUT_FLAG] === true;
}
