import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import reportApiError from '@/utils/reportApiError';
import getRetentionOptions from '../services/getRetentionOptions';

/** Fetched fresh every time the sheet opens, then left alone so the steps don't shift mid-flow. */
export default function useRetentionOptions() {
    const query = useQuery({
        queryKey: ['retention-options'],
        queryFn: getRetentionOptions,
        staleTime: 0,
        gcTime: 0,
        retry: 1,
        networkMode: 'always',
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });
    const { error } = query;

    useEffect(() => {
        if (error) reportApiError(error, { feature: 'retention', operation: 'getRetentionOptions' });
    }, [error]);

    return query;
}
