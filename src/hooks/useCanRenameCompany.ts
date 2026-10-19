import { useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import canRenameCompany from '@/views/Organization/shared/utils/canRenameCompany';

/**
 * @returns {boolean} If true, user can rename their company (Settings → Company).
 * Allowed: owners and superadmins of a team account.
 */
export default function useCanRenameCompany(): boolean {
    const { globalUser } = useAuth();
    return useMemo(
        () => globalUser?.account_type === 'team' && canRenameCompany(globalUser.role ?? null),
        [globalUser],
    );
}
