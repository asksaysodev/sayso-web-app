import { useEffect } from 'react';
import axios from 'axios';
import type { ScopeSelection } from '@/types/scope';

/**
 * A team or member that no longer exists drops the admin back to the whole company (the default), silently:
 * either the server 404s it, or the loaded team/member lists don't have it.
 * @returns `true` while the reset is pending, so the caller can hold its loading state instead of an error.
 */
export default function useResetConversationScope(
    error: unknown,
    isStale: boolean,
    selection: ScopeSelection | null,
    isAdmin: boolean,
    resetToCompany: () => void,
): boolean {
    const isNotFound = axios.isAxiosError(error) && error.response?.status === 404;
    const isResetting = isAdmin && selection !== null && (isNotFound || isStale);

    useEffect(() => {
        if (isResetting) resetToCompany();
    }, [isResetting, resetToCompany]);

    return isResetting;
}
