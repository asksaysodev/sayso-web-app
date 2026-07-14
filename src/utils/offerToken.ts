/**
 * Legacy-pricing offer token (SAYSO-317).
 *
 * Invited users arrive via a URL like `/signup?offer=<token>`. We keep the token
 * client-side (localStorage) so it survives the signup flow, pass it to the
 * pricing endpoint to surface the retained legacy pricing, and show a banner
 * while it is active. Intentionally not account-bound for v1.
 */
const OFFER_TOKEN_KEY = 'sayso-offer-token';

export function getOfferToken(): string | null {
    try {
        return localStorage.getItem(OFFER_TOKEN_KEY);
    } catch {
        return null;
    }
}

export function setOfferToken(token: string): void {
    try {
        localStorage.setItem(OFFER_TOKEN_KEY, token);
    } catch {
        /* ignore storage failures (private mode, etc.) */
    }
}

export function clearOfferToken(): void {
    try {
        localStorage.removeItem(OFFER_TOKEN_KEY);
    } catch {
        /* ignore */
    }
}

/**
 * Read `?offer=<token>` from a URL search string and persist it when present.
 * Returns the active token (freshly captured or previously stored).
 */
export function captureOfferTokenFromSearch(search: string): string | null {
    const token = new URLSearchParams(search).get('offer');
    if (token) setOfferToken(token);
    return token ?? getOfferToken();
}
