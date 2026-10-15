import { useMemo } from 'react';
import useDashboardScope from './useDashboardScope';
import type { DashboardRequestParams } from '../types';

/**
 * Turns the Filters selection into `/dashboard/*` query params plus a stable cache key.
 * Admins send `scope=company` when nothing is picked; members send nothing and the server scopes to them.
 */
export default function useDashboardRequestScope(): { params: DashboardRequestParams; key: string } {
    const { isAdmin, selection } = useDashboardScope();

    return useMemo(() => {
        if (!isAdmin) return { params: {}, key: 'self' };
        if (!selection) return { params: { scope: 'company' }, key: 'company' };
        return {
            params: { scope: selection.scope, scopeId: selection.id },
            key: `${selection.scope}:${selection.id}`,
        };
    }, [isAdmin, selection]);
}
