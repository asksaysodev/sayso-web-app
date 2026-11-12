import { useAuth } from '@/context/AuthContext';
import { useMemo } from 'react';

/**
 * @returns {boolean} If true, user can see and manage the account's subscription/billing.
 * Mirrors the server's requireBillingAccess: only team accounts are restricted (to
 * owners/superadmins). Individual accounts and companies with no account type yet
 * (e.g. after an admin subscription reset) can bill.
 */
export default function useCanManageBilling(): boolean {
    const { globalUser } = useAuth();
    return useMemo(() => {
        if (!globalUser) return false;
        if (globalUser.account_type !== 'team') return true;
        return globalUser.role === 'owner' || globalUser.role === 'superadmin';
    }, [globalUser]);
}
