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
