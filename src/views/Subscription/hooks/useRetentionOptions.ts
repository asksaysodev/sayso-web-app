import { useQuery } from '@tanstack/react-query';
import getRetentionOptions from '../services/getRetentionOptions';

/** Fetched fresh every time the sheet opens, then left alone so the steps don't shift mid-flow. */
export default function useRetentionOptions() {
    return useQuery({
        queryKey: ['retention-options'],
        queryFn: getRetentionOptions,
        staleTime: 0,
        gcTime: 0,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });
}
