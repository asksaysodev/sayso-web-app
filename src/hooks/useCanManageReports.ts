import { useAuth } from '@/context/AuthContext';
import { TEAM_ADMIN_ROLES } from '@/types/user';
import { useMemo } from 'react';

/**
 * @returns {boolean} If true, user can see and manage the account's email report preferences.
 * Mirrors the server rule (utils/reportAccess.js): team owners/admins/superadmins only.
 * Blocked: other team members and individual accounts of any role (SAYSO-597).
 */
export default function useCanManageReports(): boolean {
    const { globalUser } = useAuth();
    return useMemo(() => {
        if (!globalUser) return false;
        return globalUser.account_type === 'team' &&
            !!globalUser.role && TEAM_ADMIN_ROLES.includes(globalUser.role);
    }, [globalUser]);
}
