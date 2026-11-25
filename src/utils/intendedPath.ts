const DEFAULT_PATH = '/';
const AUTH_ROUTES = ['/login', '/signup', '/mfa-verify', '/forgot-password', '/reset-password'];
const TOKEN_PARAMS = ['token_hash', 'access_token', 'refresh_token'];

/** Router state carried to /login and /mfa-verify: the page to open once the user is in. */
export interface IntendedPathState {
    from: string;
}

const hasControlCharacter = (value: string): boolean =>
    [...value].some((char) => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127);

/**
 * Internal path with its query, or null when it must not be followed: external URLs
 * (open redirect) and auth routes (redirect loop). The hash and token params are dropped.
 */
export function sanitizeIntendedPath(value: unknown): string | null {
    if (typeof value !== 'string' || !/^\/(?!\/)/.test(value)) return null;
    if (value.includes('\\') || hasControlCharacter(value)) return null;

    const url = new URL(value, window.location.origin);
    // Dot segments can normalize into a protocol-relative path: /a/..//evil.com → //evil.com
    if (url.origin !== window.location.origin || url.pathname.startsWith('//')) return null;

    const route = url.pathname.replace(/\/+$/, '').toLowerCase();
    if (AUTH_ROUTES.includes(route)) return null;

    TOKEN_PARAMS.forEach((param) => url.searchParams.delete(param));
    return url.pathname + url.search;
}

/** Where to go after login or MFA, read from router state. */
export function getIntendedPath(state: unknown): string {
    return sanitizeIntendedPath((state as Partial<IntendedPathState> | null)?.from) ?? DEFAULT_PATH;
}

/** Router state that remembers `path`, or null when there is nothing worth remembering. */
export function toIntendedState(path: string): IntendedPathState | null {
    const from = sanitizeIntendedPath(path);
    return from && from !== DEFAULT_PATH ? { from } : null;
}
