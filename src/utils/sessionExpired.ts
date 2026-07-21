const SESSION_EXPIRED_FLAG = '__saysoSessionExpired';

/**
 * Marks an error as the result of a terminally expired session — the axios
 * interceptor already dispatched `auth:session-expired` and logged the user out,
 * so anything downstream should treat it as an expected outcome, not a defect.
 */
export function markSessionExpired(error: unknown): void {
    if (!error || typeof error !== 'object') return;
    (error as Record<string, unknown>)[SESSION_EXPIRED_FLAG] = true;
}

/**
 * True when the error was flagged by {@link markSessionExpired}. Sentry drops
 * these in `beforeSend` so an expected logout never reaches the issue stream.
 */
export function isSessionExpiredError(error: unknown): boolean {
    if (!error || typeof error !== 'object') return false;
    return (error as Record<string, unknown>)[SESSION_EXPIRED_FLAG] === true;
}
