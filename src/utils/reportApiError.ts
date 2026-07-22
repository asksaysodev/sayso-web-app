import * as Sentry from "@sentry/react";
import axios from "axios";

interface Context {
    feature: string;
    operation: string;
}

/**
 * Reports an API failure to Sentry, skipping the ones that are expected outcomes
 * rather than defects: cancelled requests, and 4xx responses (validation errors,
 * expired sessions, stale or already-claimed resources) which callers surface in
 * the UI. Only unexpected failures — 5xx, network errors, malformed payloads —
 * reach the issue stream.
 */
export default function reportApiError(error: unknown, { feature, operation }: Context): void {
    if (axios.isCancel(error)) return;

    const status = axios.isAxiosError(error) ? error.response?.status : undefined;
    if (status !== undefined && status >= 400 && status < 500) return;

    Sentry.captureException(error, {
        tags: { feature, operation },
        extra: { status },
    });
}
