import { useAuth } from '@/context/AuthContext';
import { useMemo } from 'react';

/**
 * @returns {boolean} If true, user can see and manage the account's subscription/billing.
 * Allowed: individual accounts (single user), and owners/superadmins of a team account.
 */
export default function useCanManageBilling(): boolean {
    const { globalUser } = useAuth();
    return useMemo(() => {
        if (!globalUser) return false;
        if (globalUser.account_type === 'individual') return true;
        return globalUser.account_type === 'team' &&
            (globalUser.role === 'owner' || globalUser.role === 'superadmin');
    }, [globalUser]);
}
