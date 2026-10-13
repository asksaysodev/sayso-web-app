import { useCallback, useSyncExternalStore } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { DASHBOARD_QUERY_KEY } from '../queryKeys';

/** Timestamp of the most recent successful fetch among the on-screen `['dashboard']` queries, or `null` before the first one lands. */
export default function useDashboardLastUpdate(): number | null {
    const queryClient = useQueryClient();
    const queryCache = queryClient.getQueryCache();

    const subscribe = useCallback((onChange: () => void) => queryCache.subscribe(onChange), [queryCache]);

    const getSnapshot = useCallback(() => {
        const latest = Math.max(
            0,
            ...queryCache.findAll({ queryKey: DASHBOARD_QUERY_KEY, type: 'active' }).map((query) => query.state.dataUpdatedAt),
        );
        return latest > 0 ? latest : null;
    }, [queryCache]);

    return useSyncExternalStore(subscribe, getSnapshot);
}
