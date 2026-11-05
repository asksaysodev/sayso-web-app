import { useAuth } from '@/context/AuthContext';
import { getProvider } from './providers/registry';
import type { CrmConnection, CrmProviderId } from './types';

function connected(providerId: CrmProviderId): CrmConnection {
    return { isConnected: true, providerId, providerLabel: getProvider(providerId).label };
}

export default function useCrmConnection(): CrmConnection {
    const { globalUser } = useAuth();

    if (globalUser?.fub_connected) return connected('fub');
    if (globalUser?.suresend_connected) return connected('suresend');

    return { isConnected: false, providerId: null, providerLabel: null };
}
