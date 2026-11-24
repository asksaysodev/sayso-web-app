import type { AxiosRequestConfig } from 'axios';

/**
 * Retention POSTs change billing: never resend them automatically, and outlast the server's own
 * Stripe calls (up to five, 10 s each) so a slow success isn't read as a failure.
 */
export const RETENTION_ACTION_CONFIG: AxiosRequestConfig = { skipRetry: true, timeout: 60_000 };
