import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import reportApiError from '@/utils/reportApiError';
import { getAdminPlaybooks } from '../services/getAdminPlaybooks';
import { ADMIN_PLAYBOOKS_QUERY_KEY } from './queryKeys';

const PROCESSING_POLL_INTERVAL_MS = 5000;

export function useAdminPlaybooks() {
    const { data, isLoading, isError, error, isFetching, refetch } = useQuery({
        queryKey: ADMIN_PLAYBOOKS_QUERY_KEY,
        queryFn: getAdminPlaybooks,
        refetchInterval: (query) =>
            query.state.data?.some(playbook => playbook.status === 'processing') ? PROCESSING_POLL_INTERVAL_MS : false,
    });

    useEffect(() => {
        if (error) reportApiError(error, { feature: 'admin-playbooks', operation: 'getAdminPlaybooks' });
    }, [error]);

    const playbooks = data ?? [];

    return {
        playbooks,
        isLoading,
        isError,
        isFetching,
        isRetrying: isFetching && !isLoading,
        refetch,
        isEmpty: !isLoading && !isError && playbooks.length === 0,
        processingCount: playbooks.filter(playbook => playbook.status === 'processing').length,
    };
}
