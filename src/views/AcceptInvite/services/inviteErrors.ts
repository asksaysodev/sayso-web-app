import axios, { AxiosError } from 'axios';

/**
 * The distinct outcomes of GET /accounts/company/invite/validate, as far as the UI is
 * concerned.
 */
export type InviteErrorKind =
    | 'ACCEPTED'
    | 'EXPIRED'
    | 'REVOKED'
    | 'INVALID'
    | 'RATE_LIMITED'
    | 'TRANSIENT';

/**
 * Unlike /accounts/signup, the validate endpoint sends no `code` — only prose — so this
 * matches the strings the controller returns. Reworded server copy therefore degrades to
 * INVALID or TRANSIENT rather than breaking; it never crosses the cases.
 */
const PROSE_TO_KIND: Record<string, InviteErrorKind> = {
    'Invite has already been accepted': 'ACCEPTED',
    'Invite has been revoked': 'REVOKED',
    'Invite has expired': 'EXPIRED',
    'Invalid or expired invite token': 'EXPIRED',
    'Invite not found': 'INVALID',
    'Token is required': 'INVALID',
    'Failed to validate invite': 'INVALID',
};

export function toInviteErrorKind(error: unknown): InviteErrorKind {
    if (!axios.isAxiosError(error)) return 'TRANSIENT';

    const response = (error as AxiosError<{ error?: string }>).response;

    if (!response) return 'TRANSIENT';

    const { status, data } = response;

    if (status === 429) return 'RATE_LIMITED';
    if (status >= 500) return 'TRANSIENT';
    if (status === 404) return 'INVALID';
    if (status === 400) return PROSE_TO_KIND[data?.error ?? ''] ?? 'INVALID';

    return 'TRANSIENT';
}
