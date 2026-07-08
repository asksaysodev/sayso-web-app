import { useAuth } from '@/context/AuthContext';
import type { CrmConnection } from './types';

export default function useCrmConnection(): CrmConnection {
    const { globalUser } = useAuth();

    if (!globalUser) {
        return { isConnected: false, providerId: null, providerLabel: null };
    }

    if (globalUser.fub_connected) {
        return { isConnected: true, providerId: 'fub', providerLabel: 'Follow Up Boss' };
    }

    if (globalUser.suresend_connected) {
        return { isConnected: true, providerId: 'suresend', providerLabel: 'SureSend' };
    }

    return { isConnected: false, providerId: null, providerLabel: null };
}
