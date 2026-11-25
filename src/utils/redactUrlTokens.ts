/** Masks auth tokens in a URL (desktop handoff, password recovery) so they never reach Sentry. */
export function redactUrlTokens(url: string): string {
    return url.replace(/((?:token_hash|access_token|refresh_token)=)[^&#\s]*/g, '$1[redacted]');
}
