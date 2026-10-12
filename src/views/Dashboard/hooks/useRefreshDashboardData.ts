import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { DASHBOARD_QUERY_KEY } from '../queryKeys';

export default function useRefreshDashboardData() {
    const queryClient = useQueryClient();

    const refreshDashboardData = useCallback(() => {
        queryClient.refetchQueries({ queryKey: DASHBOARD_QUERY_KEY });
    }, [queryClient]);

    return { refreshDashboardData };
}
