import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import reportApiError from '@/utils/reportApiError';
import getTeams from '../services/getTeams';
import { TEAMS_QUERY_KEY } from './queryKeys';

/**
 * Every team in the company with usage — the Teams list, and the invite modal's team options.
 * @param enabled - Pass `false` while a modal is closed to skip the fetch.
 */
export default function useTeams(enabled = true) {
    const { data, isLoading, isError, error, isFetching, refetch } = useQuery({
        queryKey: TEAMS_QUERY_KEY,
        queryFn: getTeams,
        enabled,
    });

    useEffect(() => {
        if (error) reportApiError(error, { feature: 'teams', operation: 'getTeams' });
    }, [error]);

    return {
        teams: data ?? [],
        isLoading,
        isError,
        isRetrying: isFetching && !isLoading,
        retry: refetch,
    };
}
