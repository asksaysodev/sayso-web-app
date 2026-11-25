import type { AxiosRequestConfig } from 'axios';

/**
 * Retention POSTs change billing: never resend them automatically, and wait well past the default
 * timeout for the server's chain of Stripe calls. Anything slower is handled as unconfirmed.
 */
export const RETENTION_ACTION_CONFIG: AxiosRequestConfig = { skipRetry: true, timeout: 60_000 };
