import { useAuth } from '@/context/AuthContext';
import { useMemo } from 'react';

/**
 * @returns {boolean} If true, user can access the Referrals tab.
 * Allowed: individual users and team admins/superadmins.
 * Blocked: team members who are not admins.
 */
export default function useCanAccessReferrals(): boolean {
    const { globalUser } = useAuth();
    return useMemo(() => {
        if (!globalUser) return false;
        if (globalUser.account_type === 'individual') return true;
        return globalUser.account_type === 'team' &&
            (globalUser.role === 'admin' || globalUser.role === 'superadmin');
    }, [globalUser]);
}
