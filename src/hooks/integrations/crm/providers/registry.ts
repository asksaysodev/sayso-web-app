import { fubProvider } from './fub';
import { suresendProvider } from './suresend';
import type { CrmProvider, CrmProviderId } from '../types';

const PROVIDERS: Record<CrmProviderId, CrmProvider> = {
    fub: fubProvider,
    suresend: suresendProvider,
};

export function getProvider(id: CrmProviderId): CrmProvider {
    return PROVIDERS[id];
}
