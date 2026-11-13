/**
 * Remembers, per signed-in user, whether their dashboard last rendered the subscriber widgets
 * or the no-plan empty state. The sign-in skeleton reads it before the account has loaded, so a
 * user without a plan doesn't see the widget skeleton swap into the empty state.
 */
const key = (userId: string) => `sayso:dashboard-has-subscription:${userId}`;

/** `null` when unknown (first visit on this browser, or storage unavailable). */
export function readSubscriptionHint(userId: string | undefined): boolean | null {
    if (!userId) return null;
    try {
        const value = localStorage.getItem(key(userId));
        return value === null ? null : value === 'true';
    } catch {
        return null;
    }
}

export function writeSubscriptionHint(userId: string | undefined, hasSubscription: boolean): void {
    if (!userId) return;
    try {
        localStorage.setItem(key(userId), String(hasSubscription));
    } catch {
        /* ignore storage failures (private mode, etc.) */
    }
}
