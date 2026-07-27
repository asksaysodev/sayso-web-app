import type { AxiosError } from 'axios';
import type { CrmProviderId } from './types';

/**
 * The CRM grant is dead — the server has cleared the connection and the user must
 * reconnect. Retrying never succeeds, so callers show a reconnect CTA instead.
 */
export class CrmReauthRequiredError extends Error {
    providerId: CrmProviderId;

    constructor(providerId: CrmProviderId) {
        super(`${providerId} reauthorization required`);
        this.name = 'CrmReauthRequiredError';
        this.providerId = providerId;
    }
}

/**
 * When the server signals a dead grant (409 `<provider>_reauth_required`), turn it
 * into a CrmReauthRequiredError so callers surface a reconnect CTA. Any other error
 * is returned untouched. Shared by every provider — the marker is derived from the id.
 */
export function crmReauthErrorFrom(error: unknown, providerId: CrmProviderId): unknown {
    const response = (error as AxiosError<{ error?: string }>)?.response;
    if (response?.status === 409 && response.data?.error === `${providerId}_reauth_required`) {
        return new CrmReauthRequiredError(providerId);
    }
    return error;
}
