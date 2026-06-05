import { fubProvider } from './fub';
import type { CrmProvider, CrmProviderId } from '../types';

const PROVIDERS: Record<CrmProviderId, CrmProvider> = {
    fub: fubProvider,
};

export function getProvider(id: CrmProviderId): CrmProvider {
    return PROVIDERS[id];
}
