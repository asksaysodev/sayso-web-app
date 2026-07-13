import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPartners } from '../services/getPartners';
import reportApiError from '@/utils/reportApiError';

export function usePartners() {
    const { data, isLoading, isError, error, isFetching, refetch } = useQuery({
        queryKey: ['admin-partners'],
        queryFn: getPartners,
    });

    useEffect(() => {
        if (error) reportApiError(error, { feature: 'admin-partners', operation: 'getPartners' });
    }, [error]);

    return {
        partners: data ?? [],
        isLoading,
        isError,
        isRetrying: isFetching && !isLoading,
        retry: refetch,
        isEmpty: !isLoading && !isError && (data?.length ?? 0) === 0,
    };
}
